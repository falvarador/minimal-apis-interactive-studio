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

export class Module3Responses extends Component<Record<string, never>> {
  private readonly returnMode = signal('typedExplicit');
  private readonly envMode = signal('Development');
  private readonly statusCodePages = signal(true);
  private readonly simScenario = signal('404');

  render() {
    const [returnMode, setReturnMode] = bindSignal(this.returnMode);
    const [envMode, setEnvMode] = bindSignal(this.envMode);
    const [statusCodePages, setStatusCodePages] = bindSignal(this.statusCodePages);
    const [simScenario, setSimScenario] = bindSignal(this.simScenario);
    
    return (
    <div className={`${styles.responsesReturnTypesLabContainerLayout} ${styles.module}`}>
      {/* TypedResults vs Results Compiler Lab */}
      <div className={styles.responsesReturnTypesLabContentPanel}>
        <div className={styles.responsesReturnTypesLabRow}>
          <div>
            <h3 className={styles.responsesReturnTypesLabSectionHeading}>
              <Icons.Zap className={styles.responsesElement} />
              Return Types Lab: Why <code className={styles.responsesTaskResultsNotFoundCodeText}>Task&lt;Results&lt;NotFound, Ok&lt;DishDto&gt;&gt;&gt;</code> Matters
            </h3>
            <p className={styles.responsesInPage18Description}>
              In Page 18, returning both <code className={styles.responsesTypedResultsNotFoundCodeText}>TypedResults.NotFound()</code> and <code className={styles.responsesTypedResultsNotFoundCodeText}>TypedResults.Ok(dto)</code> inside an implicit lambda triggers a cryptic compiler error: <span className={styles.responsesDelegateRequestDelegateDoesInlineText}>Delegate 'RequestDelegate' does not take 2 arguments</span>. Explore why!
            </p>
          </div>
          <div className={styles.responsesImplicitTypedResultsErrorRow}>
            <button
              onClick={() => setReturnMode('brokenTyped')}
              className={(returnMode === 'brokenTyped' ? styles.responsesImplicitTypedResultsErrorButtonConditional : styles.responsesImplicitTypedResultsErrorButtonConditionalNeutral)}
            >
              1. Implicit TypedResults (Error)
            </button>
            <button
              onClick={() => setReturnMode('untypedResults')}
              className={(returnMode === 'untypedResults' ? styles.responsesResultsOkLosesButtonConditional : styles.responsesImplicitTypedResultsErrorButtonConditionalNeutral)}
            >
              2. Results.Ok (Loses OpenAPI Metadata)
            </button>
            <button
              onClick={() => setReturnMode('typedExplicit')}
              className={(returnMode === 'typedExplicit' ? styles.responsesExplicitTypedResultsUnionButtonConditional : styles.responsesImplicitTypedResultsErrorButtonConditionalNeutral)}
            >
              3. Explicit TypedResults Union (Best!)
            </button>
          </div>
        </div>

        {returnMode === 'brokenTyped' && (
          <div className={styles.responsesCS1593DelegateRequestDelegateContainerLayout}>
            <CodeWindow
              title="Compiler Error: Two Different Concrete Return Types"
              highlightLines={[3, 5]}
              code={`app.MapGet("/dishes/{dishId:guid}", async (DishesDbContext db, Guid dishId) => {
    var dish = await db.Dishes.FirstOrDefaultAsync(d => d.Id == dishId);
    if (dish == null)
        return TypedResults.NotFound(); // Concrete type: NotFound
    
    return TypedResults.Ok(dish.ToDishDto()); // Concrete type: Ok<DishDto>
});`}
            />
            <div className={styles.responsesCS1593DelegateRequestDelegateContentPanel}>
              ❌ CS1593: Delegate 'RequestDelegate' does not take 2 arguments. Because C# cannot infer a common return type between concrete <code className={styles.responsesNotFoundCodeText}>NotFound</code> and <code className={styles.responsesNotFoundCodeText}>Ok&lt;DishDto&gt;</code>, overload resolution fails!
            </div>
          </div>
        )}

        {returnMode === 'untypedResults' && (
          <div className={styles.responsesCS1593DelegateRequestDelegateContainerLayout}>
            <CodeWindow
              title="Workaround: Using Results (Returns IResult Interface)"
              highlightLines={[3, 5]}
              code={`app.MapGet("/dishes/{dishId:guid}", async (DishesDbContext db, Guid dishId) => {
    var dish = await db.Dishes.FirstOrDefaultAsync(d => d.Id == dishId);
    if (dish == null)
        return Results.NotFound(); // Returns IResult
    
    return Results.Ok(dish.ToDishDto()); // Also returns IResult
});`}
            />
            <div className={styles.responsesCompilesButHidesContentPanel}>
              ⚠️ <strong>Compiles, but hides metadata:</strong> Because <code className={styles.responsesResultsCodeText}>Results</code> returns the opaque <code className={styles.responsesResultsCodeText}>IResult</code> interface, you lose compile-time type safety and OpenAPI won't automatically know what status codes or DTO schemas your endpoint returns!
            </div>
          </div>
        )}

        {returnMode === 'typedExplicit' && (
          <div className={styles.responsesCS1593DelegateRequestDelegateContainerLayout}>
            <CodeWindow
              title="Best Practice: Explicit Task<Results<T1, T2>> Union Signature"
              highlightLines={[2, 6, 8]}
              code={`app.MapGet("/dishes/{dishId:guid}", 
    async Task<Results<NotFound, Ok<DishDto>>> (DishesDbContext db, Guid dishId) => {
        var dish = await db.Dishes.FirstOrDefaultAsync(d => d.Id == dishId);
        if (dish == null)
            return TypedResults.NotFound();
        
        return TypedResults.Ok(dish.ToDishDto());
    });`}
            />
            <div className={styles.responsesCompileTimeSafetyContentPanel}>
              ✅ <strong>Compile-Time Safety + Automatic OpenAPI Spec:</strong> If you accidentally return an <code className={styles.responsesResultsCodeText}>IngredientDto</code> instead of <code className={styles.responsesResultsCodeText}>DishDto</code>, the compiler catches it immediately, and Scalar/OpenAPI automatically documents both <code className={styles.responsesResultsCodeText}>200 OK</code> and <code className={styles.responsesResultsCodeText}>404 Not Found</code>!
            </div>
          </div>
        )}
      </div>

      {/* RFC 9457 Problem Details & Exception Middleware Simulator */}
      <div className={styles.responsesReturnTypesLabContentPanel}>
        <h3 className={styles.responsesRFC9457ProblemSectionHeading}>
          <Icons.AlertTriangle className={styles.responsesElementWarning} />
          RFC 9457 Problem Details & Environment Exception Simulator
        </h3>
        <p className={styles.responsesToggleAppUseStatusCodePagesDescription}>
          Toggle <code className={styles.responsesAppUseStatusCodePagesCodeText}>app.UseStatusCodePages()</code> and switch between <strong>Development</strong> and <strong>Production</strong> environments to see how <code className={styles.responsesAppUseStatusCodePagesCodeText}>builder.Services.AddProblemDetails()</code> standardizes all API errors!
        </p>

        <div className={styles.responsesPipelineEnvironmentControlsGrid}>
          <div className={styles.responsesPipelineEnvironmentControlsContainerLayout}>
            <div className={styles.responsesPipelineEnvironmentControlsContentPanel}>
              <div className={styles.responsesPipelineEnvironmentControlsContainerLayoutNeutral}>
                Pipeline & Environment Controls
              </div>

              <div className={styles.responsesASPNETCOREENVIRONMENTDevelopmentRow}>
                <span className={styles.responsesASPNETCOREENVIRONMENTInlineText}>ASPNETCORE_ENVIRONMENT</span>
                <div className={styles.responsesDevelopmentProductionRow}>
                  <button
                    onClick={() => setEnvMode('Development')}
                    className={(envMode === 'Development' ? styles.responsesDevelopmentButtonConditional : styles.responsesDevelopmentButtonConditionalNeutral)}
                  >
                    Development
                  </button>
                  <button
                    onClick={() => setEnvMode('Production')}
                    className={(envMode === 'Production' ? styles.responsesProductionButtonConditional : styles.responsesDevelopmentButtonConditionalNeutral)}
                  >
                    Production
                  </button>
                </div>
              </div>

              <label className={styles.responsesAppUseStatusCodePagesTranslatesFieldLabel}>
                <div>
                  <div className={styles.responsesAppUseStatusCodePagesContainerLayout}>app.UseStatusCodePages()</div>
                  <div className={styles.responsesTranslatesEmpty404ContainerLayout}>Translates empty 404/401/403 responses into ProblemDetails</div>
                </div>
                <input
                  type="checkbox"
                  checked={statusCodePages}
                  onChange={(e) => setStatusCodePages(e.currentTarget.checked)}
                  className={styles.responsesTextField}
                />
              </label>

              <div className={styles.responsesTestErrorScenarioContainerLayout}>
                <div className={styles.responsesTestErrorScenarioContainerLayoutNeutral}>Test Error Scenario:</div>
                <div className={styles.responsesGETDishesUnknownGrid}>
                  <button
                    onClick={() => setSimScenario('404')}
                    className={(simScenario === '404' ? styles.responsesGETDishesUnknownButtonConditional : styles.responsesGETDishesUnknownButtonConditionalNeutral)}
                  >
                    GET /dishes/unknown-guid (404)
                  </button>
                  <button
                    onClick={() => setSimScenario('500')}
                    className={(simScenario === '500' ? styles.responsesGETTesterror500ButtonConditional : styles.responsesGETDishesUnknownButtonConditionalNeutral)}
                  >
                    GET /testerror (500 Exception)
                  </button>
                </div>
              </div>
            </div>

            <CodeWindow
              title="Program.cs Error Handling Setup"
              code={`builder.Services.AddProblemDetails();
var app = builder.Build();

if (!app.Environment.IsDevelopment()) {
    app.UseExceptionHandler(); // Clean 500 in Production
}
${statusCodePages ? 'app.UseStatusCodePages(); // Populates 404 ProblemDetails body' : '// app.UseStatusCodePages(); (Disabled!)'}`}
            />
          </div>

          <div className={styles.responsesHTTPResponseInspectorContainerLayout}>
            <div className={styles.responsesHTTPResponseInspectorStack}>
              <div className={styles.responsesHTTPResponseInspectorRow}>
                <span className={styles.responsesHTTPResponseInspectorInlineText}>HTTP Response Inspector</span>
                <span className={(simScenario === '404' ? styles.responsesBadgeConditional : styles.responsesBadgeConditionalDanger)}>
                  {simScenario === '404' ? 'HTTP/1.1 404 Not Found' : 'HTTP/1.1 500 Internal Server Error'}
                </span>
              </div>
              <div className={styles.responsesContentTypeRow}>
                <div className={styles.responsesContentTypeContainerLayout}>
                  Content-Type: {simScenario === '404' && !statusCodePages ? 'None (Empty Body)' : 'application/problem+json; charset=utf-8'}
                </div>
                <pre className={styles.responsesCodeText}>
{simScenario === '404' && !statusCodePages
  ? `// Empty Response Body!
// Without app.UseStatusCodePages(), AddProblemDetails() alone 
// does not generate a payload for 404 NotFound responses.`
  : simScenario === '404' && statusCodePages
  ? JSON.stringify({
      type: "https://tools.ietf.org/html/rfc9110#section-15.5.5",
      title: "Not Found",
      status: 404
    }, null, 2)
  : envMode === 'Development'
  ? JSON.stringify({
      type: "https://tools.ietf.org/html/rfc9110#section-15.6.1",
      title: "System.NotImplementedException",
      status: 500,
      detail: "The method or operation is not implemented.",
      exception: {
        details: "System.NotImplementedException: The method or operation is not implemented.\n   at Program.<>c.<<Main>$>b__0_1() in Program.cs:line 28"
      }
    }, null, 2)
  : JSON.stringify({
      type: "https://tools.ietf.org/html/rfc9110#section-15.6.1",
      title: "An error occurred while processing your request.",
      status: 500
    }, null, 2)}
                </pre>
                {simScenario === '500' && (
                  <div className={(envMode === 'Development' ? styles.responsesContentPanelConditional : styles.responsesContentPanelConditionalSuccess)}>
                    {envMode === 'Development'
                      ? '🔍 Development Mode: DeveloperExceptionPageMiddleware includes the full stack trace for debugging.'
                      : '🔒 Production Mode: ExceptionHandlerMiddleware hides sensitive stack traces while keeping the standardized RFC 9457 contract!'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  }
}
