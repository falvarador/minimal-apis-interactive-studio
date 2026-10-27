import { act, fireEvent, render, screen } from '@testing-library/preact'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CodeWindow } from './CodeWindow'

describe('CodeWindow', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders trimmed source with line numbers and selected highlights', () => {
    const { container } = render(<CodeWindow title="sample.cs" code={'\nfirst\nsecond\n'} highlightLines={[2]} />)
    expect(screen.getByText('first')).toBeTruthy()
    expect(screen.getByText('second')).toBeTruthy()
    expect(container.querySelector('[data-line="1"]')?.getAttribute('data-highlighted')).toBe('false')
    expect(container.querySelector('[data-line="2"]')?.getAttribute('data-highlighted')).toBe('true')

    const empty = render(<CodeWindow title="empty.cs" code="" highlightLines={[]} />)
    expect(empty.container.querySelector('[data-line="1"]')?.getAttribute('data-highlighted')).toBe('false')
  })

  it('copies trimmed code and clears feedback after 1800 ms', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    })
    vi.useFakeTimers()
    render(<CodeWindow title="sample.cs" code={'\nclass Sample {}\n'} />)
    fireEvent.click(screen.getByRole('button', { name: 'Copy code from sample.cs' }))
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy code from sample.cs' }))
      await Promise.resolve()
    })
    expect(writeText).toHaveBeenCalledWith('class Sample {}')
    expect(screen.getByRole('status').textContent).toBe('Copied')
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1800)
    })
    expect(screen.getByRole('status').textContent).toBe('')
  })

  it('keeps copy feedback isolated between code windows', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
    render(
      <>
        <CodeWindow title="first.cs" code="class First {}" />
        <CodeWindow title="second.cs" code="class Second {}" />
      </>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Copy code from first.cs' }))
    await act(async () => { await Promise.resolve() })

    const statuses = screen.getAllByRole('status')
    expect(statuses[0].textContent).toBe('Copied')
    expect(statuses[1].textContent).toBe('')
  })

  it('reports clipboard failures without claiming success', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    })
    render(<CodeWindow title="sample.cs" code="class Sample {}" />)
    fireEvent.click(screen.getByRole('button', { name: 'Copy code from sample.cs' }))
    expect(await screen.findByRole('alert')).toBeTruthy()
    expect(screen.queryByText('Copied')).toBeNull()
  })

  it('uses the document fallback when the Clipboard API is unavailable and removes its temporary field', async () => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined })
    const execCommand = vi.fn(() => true)
    Object.defineProperty(document, 'execCommand', { configurable: true, value: execCommand })
    render(<CodeWindow title="fallback.cs" code="class Fallback {}" />)
    fireEvent.click(screen.getByRole('button', { name: 'Copy code from fallback.cs' }))
    await act(async () => { await Promise.resolve() })
    expect(execCommand).toHaveBeenCalledWith('copy')
    expect(document.querySelector('textarea')).toBeNull()
    expect(screen.getByRole('status').textContent).toBe('Copied')
  })

  it('does not schedule copy feedback after an in-flight copy resolves after unmount', async () => {
    let resolveCopy!: () => void
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: () => new Promise<void>(resolve => { resolveCopy = resolve }) },
    })
    vi.useFakeTimers()
    const { unmount } = render(<CodeWindow title="async.cs" code="class Async {}" />)
    fireEvent.click(screen.getByRole('button', { name: 'Copy code from async.cs' }))
    unmount()
    await act(async () => {
      resolveCopy()
      await Promise.resolve()
    })
    expect(vi.getTimerCount()).toBe(0)
  })
})
