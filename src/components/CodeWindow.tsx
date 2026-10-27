import { Component } from 'preact';
import { signal, type Signal } from '@preact/signals';
import styles from './CodeWindow.module.css';
import * as Icons from 'lucide-preact';
import type { CodeWindowProps, StateUpdater } from '../types';

function bindSignal<T>(target: Signal<T>): [T, (next: StateUpdater<T>) => void] {
  return [target.value, (next) => {
    target.value = typeof next === 'function'
      ? (next as (previous: T) => T)(target.value)
      : next;
  }];
}

export class CodeWindow extends Component<CodeWindowProps> {
  private readonly copied = signal(false);
  private readonly copyError = signal('');
  private copyTimer: number | undefined;
  private copyGeneration = 0;
  private mounted = false;

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
    this.copyGeneration += 1;
    window.clearTimeout(this.copyTimer);
  }

  render() {
    const [copied, setCopied] = bindSignal(this.copied);
    const [copyError, setCopyError] = bindSignal(this.copyError);
    const { title, code, highlightLines = [], badge = 'C# 14 / .NET 10' } = this.props;
    const lines = code.trim().split('\n');

    const handleCopy = async () => {
      const generation = ++this.copyGeneration;
      window.clearTimeout(this.copyTimer);
      setCopyError('');

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(code.trim());
        } else {
          const element = document.createElement('textarea');
          element.value = code.trim();
          element.setAttribute('readonly', '');
          element.style.position = 'fixed';
          element.style.opacity = '0';
          document.body.appendChild(element);
          let copied = false;
          try {
            element.select();
            copied = document.execCommand('copy');
          } finally {
            element.remove();
          }
          if (!copied) throw new Error('Clipboard copy was not permitted');
        }
      } catch {
        if (this.mounted && generation === this.copyGeneration) {
          setCopied(false);
          setCopyError('Could not copy code. Select the code and copy it manually.');
        }
        return;
      }

      if (!this.mounted || generation !== this.copyGeneration) return;
      setCopied(true);
      this.copyTimer = window.setTimeout(() => {
        if (this.mounted && generation === this.copyGeneration) setCopied(false);
      }, 1800);
    };

    return (
    <div className={`${styles.codeWindowContentPanel} ${styles.window}`}>
      <div className={styles.codeWindowRow}>
        <div className={styles.codeWindowRowVariant2}>
          <span className={styles.codeWindowIcon} />
          <span className={styles.codeWindowIconWarning} />
          <span className={styles.codeWindowIconSuccess} />
          <span className={styles.codeWindowInlineText}>{title}</span>
        </div>
        <div className={styles.codeWindowRowVariant2}>
          <span className={styles.codeWindowBadge}>
            {badge}
          </span>
          <button
            onClick={handleCopy}
            className={styles.codeWindowCopyCodeButton}
            title="Copy code"
            aria-label={`Copy code from ${title}`}
            aria-live="polite"
          >
            {copied ? <Icons.Check className={styles.codeWindowElement} /> : <Icons.Copy className={styles.codeWindowElementVariant2} />}
          </button>
          <span className="sr-only" role="status" aria-live="polite">{copied ? 'Copied' : ''}</span>
        </div>
      </div>
      {copyError && <p className={styles.copyError} role="alert">{copyError}</p>}
      <div className={`${styles.codeWindowContainerLayout} ${styles.codeBody}`}>
        {lines.map((line, idx) => {
          const lineNum = idx + 1;
          const isHighlighted = highlightLines.includes(lineNum);
          return (
            <div 
              key={idx} 
              data-line={lineNum}
              data-highlighted={isHighlighted}
              className={(isHighlighted ? styles.codeWindowRowConditional : styles.codeWindowRowConditionalVariant2)}
            >
              <span className={styles.codeWindowIconNeutral}>
                {lineNum}
              </span>
              <span className={styles.codeWindowInlineTextNeutral}>{line}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
  }
}
