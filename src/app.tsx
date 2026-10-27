import { Component, type CSSProperties } from 'preact';
import { signal, type Signal } from '@preact/signals';
import styles from './app.module.css';
import * as Icons from 'lucide-preact';
import type { StateUpdater } from './types';
import { cloneInitialDishes, MODULES } from './data/course';
import { Module1Intro } from './modules/Module1Intro';
import { Module2Routing } from './modules/Module2Routing';
import { Module3Responses } from './modules/Module3Responses';
import { Module4CrudLab } from './modules/Module4CrudLab';
import { Module5Architecture } from './modules/Module5Architecture';
import { Module6Security } from './modules/Module6Security';
import { Module7OpenApi } from './modules/Module7OpenApi';

function bindSignal<T>(target: Signal<T>): [T, (next: StateUpdater<T>) => void] {
  return [target.value, (next) => {
    target.value = typeof next === 'function'
      ? (next as (previous: T) => T)(target.value)
      : next;
  }];
}

export default class App extends Component<Record<string, never>> {
  private readonly activeModuleIdx = signal(0);
  private readonly completedModules = signal(['intro']);
  private readonly dishes = signal(cloneInitialDishes());

  render() {
    const [activeModuleIdx, setActiveModuleIdx] = bindSignal(this.activeModuleIdx);
    const [completedModules, setCompletedModules] = bindSignal(this.completedModules);
    const [dishes, setDishes] = bindSignal(this.dishes);
    
    const currentModule = MODULES[activeModuleIdx];

    const handleSelectModule = (idx: number) => {
    setActiveModuleIdx(idx);
    const modId = MODULES[idx].id;
    if (!completedModules.includes(modId)) {
      setCompletedModules(prev => [...prev, modId]);
    }
  };

    const resetDatabase = () => {
    setDishes(cloneInitialDishes());
  };

    return (
    <div className={`${styles.courseASPNETCoreStack} ${styles.shell}`}>
      {/* Top Header Bar */}
      <header className={styles.courseASPNETCoreHeader}>
        <div className={styles.courseASPNETCoreRow}>
          <div className={styles.courseASPNETCoreRowVariant2}>
            <div className={styles.courseRow}>
              <Icons.Code2 className={styles.courseElement} />
            </div>
            <div>
              <div className={styles.courseASPNETCoreRowVariant3}>
                <h1 className={styles.courseASPNETCoreCourseTitle}>
                  ASP.NET Core 10 Minimal APIs
                </h1>
                <span className={styles.courseInteractiveCourseCompanionBadge}>
                  Interactive Course Companion
                </span>
              </div>
              <p className={styles.course44PageTranscriptDescription}>
                44-Page Transcript Transformed into 7 Hands-on Labs • DishesAPI Project
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className={styles.courseExploredModulesRow}>
            <div className={styles.courseExploredModulesStack}>
              <div className={styles.course44PageTranscriptDescription}>
                Explored <span className={styles.courseInlineText}>{completedModules.length}</span> of {MODULES.length} Modules
              </div>
              <div className={styles.courseContainerLayout}>
                <div 
                  className={`${styles.courseAccentSurface} ${styles.progressFill}`}
                  style={{ '--progress': `${(completedModules.length / MODULES.length) * 100}%` } as CSSProperties & { '--progress': string }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className={styles.courseCourseModulesPagesGrid}>
        {/* Sidebar Module Navigation */}
        <aside className={styles.courseCourseModulesPagesAside}>
          <div className={styles.courseCourseModulesPagesContainerLayout}>
            Course Modules (Pages 1–44)
          </div>
          {MODULES.map((mod, idx) => {
            const Icon = mod.icon;
            const isActive = idx === activeModuleIdx;
            const isDone = completedModules.includes(mod.id);
            return (
              <button
                key={mod.id}
                onClick={() => handleSelectModule(idx)}
                aria-current={isActive ? 'page' : undefined}
                className={(isActive ? styles.courseButtonActive : styles.courseButtonInactive)}
              >
                <div className={styles.moduleIcon} data-accent={mod.accent}>
                  <Icon className={styles.courseElementVariant2} />
                </div>
                <div className={styles.courseRowVariant2}>
                  <div className={styles.courseRowVariant3}>
                    <span className={styles.courseInlineTextNeutral}>{mod.badge}</span>
                    {isDone && <Icons.CheckCircle2 className={styles.courseElementSuccess} />}
                  </div>
                  <div className={(isActive ? styles.courseContainerLayoutActive : styles.courseContainerLayoutInactive)}>
                    {mod.number}. {mod.title}
                  </div>
                  <div className={styles.courseContainerLayoutNeutral}>
                    {mod.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Active Interactive Lab Area */}
        <main className={styles.courseMODULENextModuleStack}>
          <div>
            {/* Module Header Bar */}
            <div className={styles.courseMODULENextModuleRow}>
              <div>
                <div className={styles.courseASPNETCoreRowVariant3}>
                  <span className={styles.courseMODULEBadge}>
                    MODULE {currentModule.number}
                  </span>
                  <span className={styles.courseInlineTextNeutralVariant2}>{currentModule.badge}</span>
                </div>
                <h2 className={styles.courseSectionHeading}>
                  {currentModule.title}
                </h2>
              </div>

              <div className={styles.courseASPNETCoreRowVariant3}>
                <button
                  onClick={() => handleSelectModule(Math.max(0, activeModuleIdx - 1))}
                  disabled={activeModuleIdx === 0}
                  className={styles.coursePreviousModuleButton}
                  title="Previous Module"
                >
                  <Icons.ChevronLeft className={styles.courseElementVariant2} />
                </button>
                <button
                  onClick={() => handleSelectModule(Math.min(MODULES.length - 1, activeModuleIdx + 1))}
                  disabled={activeModuleIdx === MODULES.length - 1}
                  className={styles.courseNextModuleButton}
                >
                  <span>Next Module</span>
                  <Icons.ChevronRight className={styles.courseElementVariant2} />
                </button>
              </div>
            </div>

            {/* Dynamic Module View */}
            {currentModule.id === 'intro' && <Module1Intro />}
            {currentModule.id === 'routing' && <Module2Routing />}
            {currentModule.id === 'responses' && <Module3Responses />}
            {currentModule.id === 'crud' && (
              <Module4CrudLab 
                dishes={dishes} 
                setDishes={setDishes} 
                resetDatabase={resetDatabase} 
              />
            )}
            {currentModule.id === 'architecture' && <Module5Architecture />}
            {currentModule.id === 'security' && <Module6Security />}
            {currentModule.id === 'openapi' && <Module7OpenApi />}
          </div>

          {/* Bottom Module Pagination Bar */}
          <div className={styles.coursePreviousLessonModuleRow}>
            <button
              onClick={() => handleSelectModule(Math.max(0, activeModuleIdx - 1))}
              disabled={activeModuleIdx === 0}
              className={styles.coursePreviousLessonButton}
            >
              <Icons.ChevronLeft className={styles.courseElementVariant2} />
              Previous Lesson
            </button>
            <div className={styles.courseModuleReReadyContainerLayout}>
              Module {activeModuleIdx + 1} of {MODULES.length} • "You're ready to be awesome!"
            </div>
            <button
              onClick={() => handleSelectModule(Math.min(MODULES.length - 1, activeModuleIdx + 1))}
              disabled={activeModuleIdx === MODULES.length - 1}
              className={styles.courseNextLessonButton}
            >
              Next Lesson
              <Icons.ChevronRight className={styles.courseElementVariant2} />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
  }
}
