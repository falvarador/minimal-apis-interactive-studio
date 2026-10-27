import { Component } from 'preact';
import { signal, type Signal } from '@preact/signals';
import styles from './labs.module.css';
import * as Icons from 'lucide-preact';
import type { StateUpdater } from '../types';

function bindSignal<T>(target: Signal<T>): [T, (next: StateUpdater<T>) => void] {
  return [target.value, (next) => {
    target.value = typeof next === 'function'
      ? (next as (previous: T) => T)(target.value)
      : next;
  }];
}

export class Module7OpenApi extends Component<Record<string, never>> {
  private readonly enableMetadata = signal(true);
  private readonly enableTransformer = signal(true);
  private readonly activeScalarEndpoint = signal('POST');

  render() {
    const [enableMetadata, setEnableMetadata] = bindSignal(this.enableMetadata);
    const [enableTransformer, setEnableTransformer] = bindSignal(this.enableTransformer);
    const [activeScalarEndpoint, setActiveScalarEndpoint] = bindSignal(this.activeScalarEndpoint);
    
    return (
    <div className={`${styles.openApiInteractiveScalarOpenAPIContainerLayout} ${styles.module}`}>
      {/* Interactive Scalar OpenAPI Documentation Previewer */}
      <div className={styles.openApiInteractiveScalarOpenAPIContentPanel}>
        <div className={styles.openApiInteractiveScalarOpenAPIRow}>
          <div>
            <h3 className={styles.openApiInteractiveScalarOpenAPISectionHeading}>
              <Icons.BookOpen className={styles.openApiElement} />
              Interactive Scalar OpenAPI UI Explorer (<code className={styles.openApiScalarV1CodeText}>/scalar/v1</code>)
            </h3>
            <p className={styles.openApiASPNETCoreDescription}>
              ASP.NET Core 10 replaces Swashbuckle with built-in <code className={styles.openApiScalarV1CodeText}>Microsoft.AspNetCore.OpenApi</code> + <code className={styles.openApiScalarV1CodeText}>Scalar.AspNetCore</code>. Toggle Endpoint Metadata and the Document Transformer below to watch the live Scalar UI update!
            </p>
          </div>
          <div className={styles.openApiWithTagsWithSummaryProducesValidationProblemRow}>
            <label className={styles.openApiWithTagsWithSummaryProducesValidationProblemFieldLabel}>
              <input
                type="checkbox"
                checked={enableMetadata}
                onChange={(e) => setEnableMetadata(e.currentTarget.checked)}
                className={styles.openApiTextField}
              />
              <span className={styles.openApiWithTagsWithSummaryProducesValidationProblemInlineText}>.WithTags() / .WithSummary() / .ProducesValidationProblem()</span>
            </label>
            <label className={styles.openApiWithTagsWithSummaryProducesValidationProblemFieldLabel}>
              <input
                type="checkbox"
                checked={enableTransformer}
                onChange={(e) => setEnableTransformer(e.currentTarget.checked)}
                className={styles.openApiTextFieldAccent}
              />
              <span className={styles.openApiWithTagsWithSummaryProducesValidationProblemInlineText}>AddDocumentTransformer (Bearer Security)</span>
            </label>
          </div>
        </div>

        {/* Simulated Scalar UI Browser Window */}
        <div className={styles.openApiHttpsLocalhost7290ContentPanel}>
          <div className={styles.openApiHttpsLocalhost7290Row}>
            <div className={styles.openApiHttpsLocalhost7290RowVariant2}>
              <span className={styles.openApiIcon} />
              <span className={styles.openApiIconWarning} />
              <span className={styles.openApiIconSuccess} />
              <span className={styles.openApiHttpsLocalhost7290Badge}>
                https://localhost:7290/scalar/v1
              </span>
            </div>
            <span className={styles.openApiSourceOpenapiV1InlineText}>Source: /openapi/v1.json</span>
          </div>

          <div className={styles.openApiOASGrid}>
            {/* Scalar Sidebar */}
            <div className={styles.openApiOASContainerLayout}>
              <div>
                <div className={styles.openApiOASRow}>
                  <h4 className={styles.openApiSectionHeading}>
                    {enableTransformer ? 'Dishes API' : 'DishesAPI | v1'}
                  </h4>
                  <span className={styles.openApiOASBadge}>
                    OAS 3.1.0
                  </span>
                </div>
                {enableTransformer && (
                  <p className={styles.openApiASPNETCoreDescription}>
                    An API for managing dishes and their ingredients (Injected via Document Transformer).
                  </p>
                )}
              </div>

              {enableTransformer && (
                <div className={styles.openApiAuthenticationBearerJWTContentPanel}>
                  <div className={styles.openApiAuthenticationBearerJWTRow}>
                    <Icons.Lock className={styles.openApiElementVariant2} />
                    Authentication: Bearer (JWT)
                  </div>
                  <input
                    type="text"
                    readOnly
                    value="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    aria-label="Simulated authentication scheme"
                    className={styles.openApiSimulatedAuthenticationSchemeTextField}
                  />
                </div>
              )}

              <div>
                <div className={styles.openApiContainerLayout}>
                  {enableMetadata ? 'TAG: Dishes' : 'Default Group'}
                </div>
                <div className={styles.openApiContainerLayoutVariant2}>
                  {[
                    { id: 'GET', verb: 'GET', path: '/dishes', summary: 'Get all dishes' },
                    { id: 'GET_ID', verb: 'GET', path: '/dishes/{dishId}', summary: 'Get a dish by ID' },
                    { id: 'POST', verb: 'POST', path: '/dishes', summary: 'Create a dish' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveScalarEndpoint(item.id)}
                      className={(activeScalarEndpoint === item.id ? styles.openApiButtonConditional : styles.openApiButtonConditionalNeutral)}
                    >
                      <span className={styles.openApiInlineText}>
                        {enableMetadata ? item.summary : item.path}
                      </span>
                      <span className={(item.verb === 'POST' ? styles.openApiBadgeConditional : styles.openApiBadgeConditionalSuccess)}>
                        {item.verb}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scalar Endpoint Detail Pane */}
            <div className={styles.openApiContainerLayoutVariant3}>
              {activeScalarEndpoint === 'POST' && (
                <div className={styles.openApiPOSTDishesDocumentedContainerLayout}>
                  <div className={styles.openApiHttpsLocalhost7290RowVariant2}>
                    <span className={styles.openApiPOSTBadge}>POST</span>
                    <span className={styles.openApiDishesInlineText}>/dishes</span>
                  </div>
                  <h4 className={styles.openApiSectionHeadingVariant2}>
                    {enableMetadata ? 'Create a dish' : 'POST /dishes'}
                  </h4>
                  {enableMetadata && (
                    <p className={styles.openApiCreatesNewDishDescription}>
                      Creates a new dish in the database. Requires the RequireAdminFromBelgium policy.
                    </p>
                  )}

                  <div className={styles.openApiDocumentedResponsesInferredContainerLayout}>
                    <div className={styles.openApiDocumentedResponsesInferredContainerLayoutNeutral}>
                      Documented Responses (Inferred from TypedResults + Metadata)
                    </div>
                    <div className={styles.openApi201CreatedApplicationRow}>
                      <span className={styles.openApi201CreatedInlineText}>201 Created</span>
                      <span className={styles.openApiApplicationJsonSchemaInlineText}>application/json (Schema: DishDto) — Inferred from CreatedAtRoute&lt;DishDto&gt;</span>
                    </div>
                    {enableMetadata ? (
                      <div className={styles.openApi400BadRequestRow}>
                        <span className={styles.openApi400BadRequestInlineText}>400 Bad Request</span>
                        <span className={styles.openApiApplicationJsonSchemaInlineText}>application/problem+json (HttpValidationProblemDetails) — Added via .ProducesValidationProblem()!</span>
                      </div>
                    ) : (
                      <div className={styles.openApiMissing400BadContentPanel}>
                        ⚠️ Missing 400 Bad Request in docs! Enable <code className={styles.openApiProducesValidationProblemCodeText}>.ProducesValidationProblem()</code> above to document validation errors.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeScalarEndpoint !== 'POST' && (
                <div className={styles.openApiPOSTDishesDocumentedContainerLayout}>
                  <div className={styles.openApiHttpsLocalhost7290RowVariant2}>
                    <span className={styles.openApiGETBadge}>GET</span>
                    <span className={styles.openApiDishesInlineText}>
                      {activeScalarEndpoint === 'GET' ? '/dishes' : '/dishes/{dishId}'}
                    </span>
                  </div>
                  <h4 className={styles.openApiSectionHeadingVariant2}>
                    {enableMetadata 
                      ? (activeScalarEndpoint === 'GET' ? 'Get all dishes' : 'Get a dish by ID') 
                      : 'Endpoint Details'}
                  </h4>
                  <div className={styles.openApi200OKSchemaContentPanel}>
                    200 OK — Schema: {activeScalarEndpoint === 'GET' ? 'DishDto[]' : 'DishDto'} (Automatically inferred from TypedResults!)
                  </div>
                  {activeScalarEndpoint === 'GET_ID' && (
                    <div className={styles.openApi404NotFoundContentPanel}>
                      404 Not Found — Inferred from Task&lt;Results&lt;NotFound, Ok&lt;DishDto&gt;&gt;&gt;
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Final Decision Matrix: Minimal APIs vs Controller-Based APIs */}
      <div className={styles.openApiInteractiveScalarOpenAPIContentPanel}>
        <h3 className={styles.openApiCourseWrapUpSectionHeading}>
          <Icons.Sparkles className={styles.openApiElementAccent} />
          Course Wrap-Up: Minimal APIs vs. Controller-Based APIs Decision Matrix
        </h3>
        <p className={styles.openApiBothApproachesShareDescription}>
          Both approaches share the exact same underlying ASP.NET Core routing engine, DI container, configuration, and Auth middleware—and you can even mix both in the same project!
        </p>

        <div className={styles.openApiCapabilityFeatureASPContainerLayout}>
          <table className={styles.openApiCapabilityFeatureASPDataTable}>
            <thead>
              <tr className={styles.openApiCapabilityFeatureASPTableRow}>
                <th className={styles.openApiCapabilityFeatureColumnHeading}>Capability / Feature</th>
                <th className={styles.openApiASPNETCoreColumnHeading}>ASP.NET Core 10 Minimal APIs</th>
                <th className={styles.openApiASPNETCoreColumnHeadingVariant2}>ASP.NET Core MVC Controllers</th>
              </tr>
            </thead>
            <tbody className={styles.openApiRoutingConstraintsFirstTableBody}>
              <tr>
                <td className={styles.openApiRoutingConstraintsTableCell}>Routing & Constraints</td>
                <td className={styles.openApiFirstClassMapGetTableCell}>✅ First-class (<code className={styles.openApiProducesValidationProblemCodeText}>MapGet</code>, <code className={styles.openApiProducesValidationProblemCodeText}>MapGroup</code>, <code className={styles.openApiProducesValidationProblemCodeText}>:guid</code>)</td>
                <td className={styles.openApiFirstClassMapGetTableCell}>✅ Attribute Routing (<code className={styles.openApiProducesValidationProblemCodeText}>[HttpGet]</code>, <code className={styles.openApiProducesValidationProblemCodeText}>[Route]</code>)</td>
              </tr>
              <tr>
                <td className={styles.openApiRoutingConstraintsTableCell}>Input Validation</td>
                <td className={styles.openApiFirstClassMapGetTableCell}>✅ Built-in in .NET 10 via <code className={styles.openApiProducesValidationProblemCodeText}>AddValidation()</code></td>
                <td className={styles.openApiFirstClassMapGetTableCell}>✅ Built-in via <code className={styles.openApiProducesValidationProblemCodeText}>[ApiController]</code> & ModelState</td>
              </tr>
              <tr>
                <td className={styles.openApiRoutingConstraintsTableCell}>Content Negotiation (XML/CSV)</td>
                <td className={styles.openApiJSONFirstIgnoresTableCell}>⚠️ JSON-first (Ignores <code className={styles.openApiProducesValidationProblemCodeText}>Accept: application/xml</code> unless using Carter)</td>
                <td className={styles.openApiFirstClassMapGetTableCell}>✅ Full OutputFormatter Content Negotiation pipeline</td>
              </tr>
              <tr>
                <td className={styles.openApiRoutingConstraintsTableCell}>Filter Pipeline</td>
                <td className={styles.openApiJSONFirstIgnoresTableCell}>⚠️ Endpoint Filters (<code className={styles.openApiProducesValidationProblemCodeText}>IEndpointFilter</code>) — lightweight</td>
                <td className={styles.openApiFirstClassMapGetTableCell}>✅ Full Action, Resource, Result & Exception Filter pipeline</td>
              </tr>
              <tr>
                <td className={styles.openApiRoutingConstraintsTableCell}>Security & OpenAPI</td>
                <td className={styles.openApiFirstClassMapGetTableCell}>✅ Full JWT Bearer, Policies, <code className={styles.openApiProducesValidationProblemCodeText}>TypedResults</code> + Scalar UI</td>
                <td className={styles.openApiFirstClassMapGetTableCell}>✅ Full JWT Bearer, Policies & OpenAPI</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  }
}
