import { Component } from 'preact';
import { signal, type Signal } from '@preact/signals';
import styles from './labs.module.css';
import * as Icons from 'lucide-preact';
import type { StateUpdater } from '../types';
import { CodeWindow } from '../components/CodeWindow';

function bindSignal<T>(target: Signal<T>): [T, (next: StateUpdater<T>) => void] {
  return [target.value, (next) => {
    target.value = typeof next === 'function'
      ? (next as (previous: T) => T)(target.value)
      : next;
  }];
}

export class Module1Intro extends Component<Record<string, never>> {
  private readonly archTab = signal('minimal');
  private readonly useControllers = signal(false);
  private readonly enableOpenApi = signal(false);
  private readonly authType = signal('None');
  private readonly pipelineStep = signal(0);
  private readonly isAnimatingPipeline = signal(false);
  private readonly requestUrl = signal('http://localhost:5034/weatherforecast');
  private pipelineTimer: number | undefined;

  render() {
    const [archTab, setArchTab] = bindSignal(this.archTab);
    const [useControllers, setUseControllers] = bindSignal(this.useControllers);
    const [enableOpenApi, setEnableOpenApi] = bindSignal(this.enableOpenApi);
    const [authType, setAuthType] = bindSignal(this.authType);
    const [pipelineStep, setPipelineStep] = bindSignal(this.pipelineStep);
    const isAnimatingPipeline = this.isAnimatingPipeline.value;
    const [requestUrl, setRequestUrl] = bindSignal(this.requestUrl);
    
    const triggerPipeline = () => {
      this.pipelineStep.value = 1;
      this.isAnimatingPipeline.value = true;
      this.pipelineTimer = window.setInterval(() => {
        const currentStep = this.pipelineStep.value;
        if (currentStep >= 5) {
          this.pipelineStep.value = 5;
          this.isAnimatingPipeline.value = false;
          window.clearInterval(this.pipelineTimer);
          this.pipelineTimer = undefined;
          return;
        }
        this.pipelineStep.value = currentStep + 1;
      }, 850);
    };

    return (
    <div className={`${styles.foundationsInstructorKevinDockxContainerLayout} ${styles.module}`}>
      {/* Hero Banner */}
      <div className={styles.foundationsInstructorKevinDockxContentPanel}>
        <div className={styles.foundationsInstructorKevinDockxRow}>
          <div>
            <span className={styles.foundationsInstructorKevinDockxBadge}>
              Instructor: Kevin Dockx (Solution Architect & Microsoft MVP)
            </span>
            <h2 className={styles.foundationsGettingStartedASPSectionHeading}>
              Getting Started with ASP.NET Core 10 Minimal APIs
            </h2>
            <p className={styles.foundationsMinimalAPIsProvideDescription}>
              Minimal APIs provide a streamlined, low-ceremony approach to building fast HTTP APIs in .NET 10 without the scaffolding of Model-View-Controller (MVC). Let's explore how they compare and inspect our initial <code className={styles.foundationsDishesAPICodeText}>DishesAPI</code> project!
            </p>
          </div>
        </div>
      </div>

      {/* Interactive MVC vs Minimal API Visualizer */}
      <div className={styles.foundationsArchitecturalPatternExplorerGrid}>
        <div className={styles.foundationsArchitecturalPatternExplorerStack}>
          <div>
            <div className={styles.foundationsArchitecturalPatternExplorerRow}>
              <h3 className={styles.foundationsArchitecturalPatternExplorerSectionHeading}>
                <Icons.Layers className={styles.foundationsElement} />
                Architectural Pattern Explorer
              </h3>
              <div className={styles.foundationsMinimalAPIASPRow}>
                <button
                  onClick={() => setArchTab('minimal')}
                  className={(archTab === 'minimal' ? styles.foundationsMinimalAPIButtonConditional : styles.foundationsMinimalAPIButtonConditionalNeutral)}
                >
                  Minimal API
                </button>
                <button
                  onClick={() => setArchTab('mvc')}
                  className={(archTab === 'mvc' ? styles.foundationsASPNETCoreButtonConditional : styles.foundationsMinimalAPIButtonConditionalNeutral)}
                >
                  ASP.NET Core MVC
                </button>
              </div>
            </div>

            {archTab === 'minimal' ? (
              <div className={styles.foundationsDirectRouteHandlerContainerLayout}>
                <div className={styles.foundationsDirectRouteHandlerContentPanel}>
                  <div className={styles.foundationsDirectRouteHandlerContainerLayoutAccent}>
                    Direct Route-to-Handler Pipeline
                  </div>
                  <div className={styles.foundationsHTTPRequestGETRow}>
                    <div className={styles.foundationsHTTPRequestGETRowNeutral}>
                      <div className={styles.foundationsHTTPRequestContainerLayout}>HTTP Request</div>
                      <div className={styles.foundationsGETDishesContainerLayout}>GET /dishes</div>
                    </div>
                    <Icons.ArrowRight className={styles.foundationsElementAccent} />
                    <div className={styles.foundationsRouteHandlerLambdaRow}>
                      <div className={styles.foundationsRouteHandlerContainerLayout}>Route Handler</div>
                      <div className={styles.foundationsLambdaStaticMethodContainerLayout}>Lambda / Static Method</div>
                    </div>
                    <Icons.ArrowRight className={styles.foundationsElementAccent} />
                    <div className={styles.foundationsHTTPRequestGETRowNeutral}>
                      <div className={styles.foundationsHTTPRequestContainerLayout}>JSON View</div>
                      <div className={styles.foundationsTypedResultsOkContainerLayout}>TypedResults.Ok</div>
                    </div>
                  </div>
                </div>
                <ul className={styles.foundationsZeroCeremonyMapsList}>
                  <li className={styles.foundationsZeroCeremonyMapsListItem}>
                    <Icons.CheckCircle2 className={styles.foundationsElementSuccess} />
                    <span><strong>Zero Ceremony:</strong> Maps URI + HTTP verb directly to a delegate or static method.</span>
                  </li>
                  <li className={styles.foundationsZeroCeremonyMapsListItem}>
                    <Icons.CheckCircle2 className={styles.foundationsElementSuccess} />
                    <span><strong>Ideal Use Cases:</strong> Microservices, lightweight APIs, proxy/aggregate APIs, JSON-first backends.</span>
                  </li>
                  <li className={styles.foundationsZeroCeremonyMapsListItem}>
                    <Icons.AlertTriangle className={styles.foundationsElementWarning} />
                    <span><strong>Out-of-the-box Tradeoffs:</strong> No built-in XML content negotiation or full MVC filter pipeline (unless using libraries like Carter).</span>
                  </li>
                </ul>
              </div>
            ) : (
              <div className={styles.foundationsDirectRouteHandlerContainerLayout}>
                <div className={styles.foundationsModelViewControllerContentPanel}>
                  <div className={styles.foundationsModelViewControllerContainerLayout}>
                    Model-View-Controller Triad
                  </div>
                  <div className={styles.foundationsControllerAcceptsInputGrid}>
                    <div className={styles.foundationsControllerAcceptsInputContentPanel}>
                      <div className={styles.foundationsControllerContainerLayout}>Controller</div>
                      <div className={styles.foundationsAcceptsInputOrchestratesContainerLayout}>Accepts input & orchestrates logic</div>
                    </div>
                    <div className={styles.foundationsControllerAcceptsInputContentPanel}>
                      <div className={styles.foundationsControllerContainerLayout}>Model</div>
                      <div className={styles.foundationsAcceptsInputOrchestratesContainerLayout}>Data, business rules & state</div>
                    </div>
                    <div className={styles.foundationsControllerAcceptsInputContentPanel}>
                      <div className={styles.foundationsControllerContainerLayout}>View (JSON)</div>
                      <div className={styles.foundationsAcceptsInputOrchestratesContainerLayout}>Formatted representation</div>
                    </div>
                  </div>
                </div>
                <ul className={styles.foundationsZeroCeremonyMapsList}>
                  <li className={styles.foundationsZeroCeremonyMapsListItem}>
                    <Icons.CheckCircle2 className={styles.foundationsElementVariant2} />
                    <span><strong>Full Filter Pipeline:</strong> Granular Action, Resource, Result, Authorization & Exception filters.</span>
                  </li>
                  <li className={styles.foundationsZeroCeremonyMapsListItem}>
                    <Icons.CheckCircle2 className={styles.foundationsElementVariant2} />
                    <span><strong>Content Negotiation:</strong> Built-in support for `Accept: application/xml`, CSV, or custom formatters.</span>
                  </li>
                  <li className={styles.foundationsZeroCeremonyMapsListItem}>
                    <Icons.CheckCircle2 className={styles.foundationsElementVariant2} />
                    <span><strong>Shared Core:</strong> Uses the exact same DI container, routing engine, and Auth middleware as Minimal APIs!</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className={styles.foundationsEFCoreSQLiteRow}>
            <span>EF Core SQLite Data Layer: <code className={styles.foundationsDishesDbCodeText}>Dishes.db</code></span>
            <span>C# <code className={styles.foundationsDishesAPICodeText}>required</code> + <code className={styles.foundationsDishesAPICodeText}>[SetsRequiredMembers]</code></span>
          </div>
        </div>

        {/* Visual Studio 2026 New Project Wizard Simulator */}
        <div className={styles.foundationsVisualStudio2026ContentPanel}>
          <div className={styles.foundationsArchitecturalPatternExplorerRow}>
            <h3 className={styles.foundationsArchitecturalPatternExplorerSectionHeading}>
              <Icons.Sliders className={styles.foundationsElementInfo} />
              Visual Studio 2026 Template Wizard
            </h3>
            <span className={styles.foundationsDishesAPICsprojBadge}>
              DishesAPI.csproj
            </span>
          </div>
          <p className={styles.foundationsToggleProjectTemplateDescription}>
            Toggle the project template options below to see why Kevin unchecks everything when starting from scratch:
          </p>

          <div className={styles.foundationsUseControllersUncheckContentPanel}>
            <label className={styles.foundationsUseControllersUncheckFieldLabel}>
              <div>
                <div className={styles.foundationsUseControllersContainerLayout}>Use controllers</div>
                <div className={styles.foundationsHTTPRequestContainerLayout}>Uncheck to use Minimal APIs instead of MVC Controllers</div>
              </div>
              <input 
                type="checkbox" 
                checked={useControllers} 
                onChange={(e) => setUseControllers(e.currentTarget.checked)}
                className={styles.foundationsTextField}
              />
            </label>

            <label className={styles.foundationsUseControllersUncheckFieldLabel}>
              <div>
                <div className={styles.foundationsUseControllersContainerLayout}>Enable OpenAPI support</div>
                <div className={styles.foundationsHTTPRequestContainerLayout}>We uncheck to build OpenAPI + Scalar cleanly from scratch in Module 7</div>
              </div>
              <input 
                type="checkbox" 
                checked={enableOpenApi} 
                onChange={(e) => setEnableOpenApi(e.currentTarget.checked)}
                className={styles.foundationsTextField}
              />
            </label>

            <div className={styles.foundationsAuthenticationTypeStartRow}>
              <div>
                <div className={styles.foundationsUseControllersContainerLayout}>Authentication Type</div>
                <div className={styles.foundationsHTTPRequestContainerLayout}>Start with None to avoid template magic; configure JWT manually later</div>
              </div>
              <select 
                value={authType}
                onChange={(e) => setAuthType(e.currentTarget.value)}
                aria-label="Authentication Type"
                className={styles.foundationsAuthenticationTypeSelect}
              >
                <option value="None">None (Course Default)</option>
                <option value="MicrosoftIdentity">Microsoft Identity Platform</option>
              </select>
            </div>
          </div>

          <CodeWindow
            title="Generated Program.cs Preview"
            badge={useControllers ? "MVC Template" : "Minimal API Template"}
            code={
              useControllers
                ? `var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers(); // <-- MVC Ceremony
${enableOpenApi ? 'builder.Services.AddOpenApi();\n' : ''}var app = builder.Build();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();`
                : `var builder = WebApplication.CreateBuilder(args);
// Register EF Core SQLite DbContext
builder.Services.AddDbContext<DishesDbContext>(o => 
    o.UseSqlite(builder.Configuration["ConnectionStrings:DishesDBConnectionString"]));
${enableOpenApi ? 'builder.Services.AddOpenApi();\n' : ''}
var app = builder.Build();
app.UseHttpsRedirection();

app.MapGet("/weatherforecast", () => "Hello Minimal API!");
app.Run();`
            }
          />
        </div>
      </div>

      {/* Interactive Request Pipeline & Middleware Simulator */}
      <div className={styles.foundationsInteractiveHTTPRequestContentPanel}>
        <div className={styles.foundationsInteractiveHTTPRequestRow}>
          <div>
            <h3 className={styles.foundationsArchitecturalPatternExplorerSectionHeading}>
              <Icons.Cpu className={styles.foundationsElementSuccessVariant2} />
              Interactive HTTP Request Pipeline & Middleware Simulator
            </h3>
            <p className={styles.foundationsWatchHowAnDescription}>
              Watch how an HTTP request travels downstream through middleware in order, hits the route handler, and travels upstream in reverse order!
            </p>
          </div>
          <div className={`${styles.foundationsGETHttpLocalhostRow} ${styles.pipelineControls}`}>
            <select
              value={requestUrl}
              onChange={(e) => {
                setRequestUrl(e.currentTarget.value);
                setPipelineStep(0);
              }}
              aria-label="Pipeline request URL"
              className={styles.foundationsPipelineRequestURLSelect}
            >
              <option value="http://localhost:5034/weatherforecast">GET http://localhost:5034/weatherforecast (200 OK)</option>
              <option value="http://localhost:5034/">GET http://localhost:5034/ (404 Not Found)</option>
            </select>
            <button
              onClick={triggerPipeline}
              disabled={isAnimatingPipeline}
              className={styles.foundationsButton}
            >
              <Icons.Play className={styles.foundationsElementVariant3} />
              {isAnimatingPipeline ? 'Tracing Request...' : 'Send Request Through Pipeline'}
            </button>
          </div>
        </div>

        <div className={styles.foundationsGrid}>
          {[
            { step: 1, title: "1. Incoming Request", desc: requestUrl, badge: "Downstream →" },
            { step: 2, title: "2. UseHttpsRedirection", desc: "Redirects HTTP :5034 to HTTPS :7290", badge: "Middleware 1" },
            { step: 3, title: "3. Endpoint Routing", desc: requestUrl.endsWith('/weatherforecast') ? "Matches MapGet('/weatherforecast')" : "No matching route found!", badge: "Middleware 2" },
            { step: 4, title: "4. Route Handler", desc: requestUrl.endsWith('/weatherforecast') ? "Executes delegate & creates array" : "Skipped (Returns 404)", badge: "Delegate" },
            { step: 5, title: "5. Upstream Response", desc: requestUrl.endsWith('/weatherforecast') ? "200 OK + JSON Payload" : "404 Not Found (Server is alive!)", badge: "← Upstream" }
          ].map((item) => {
            const active = pipelineStep === item.step;
            const passed = pipelineStep > item.step;
            return (
              <div
                key={item.step}
                className={(active ? styles.foundationsContentPanelConditional : (passed ? styles.foundationsContentPanelConditionalSuccess : styles.foundationsContentPanelConditionalNeutral))}
              >
                <div className={styles.foundationsRow}>
                  <span className={(active ? styles.foundationsInlineTextConditional : styles.foundationsInlineTextConditionalNeutral)}>{item.badge}</span>
                  {passed && <Icons.CheckCircle2 className={styles.foundationsElementSuccessVariant3} />}
                </div>
                <div className={styles.foundationsContainerLayout}>{item.title}</div>
                <div className={styles.foundationsContainerLayoutNeutral}>{item.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
  }

  componentWillUnmount() {
    window.clearInterval(this.pipelineTimer);
  }
}
