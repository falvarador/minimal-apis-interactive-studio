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

export class Module2Routing extends Component<Record<string, never>> {
  private readonly testParam = signal('d1a2b3c4-1111-4000-8000-000000000001');
  private readonly useConstraint = signal(true);
  private readonly useDtoMode = signal(false);

  render() {
    const [testParam, setTestParam] = bindSignal(this.testParam);
    const [useConstraint, setUseConstraint] = bindSignal(this.useConstraint);
    const [useDtoMode, setUseDtoMode] = bindSignal(this.useDtoMode);
    
    const isGuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(testParam);

    return (
    <div className={`${styles.routingDependencyInjectionIoCContainerLayout} ${styles.module}`}>
      {/* DI Lifetimes Visual Cards */}
      <div className={styles.routingDependencyInjectionIoCContentPanel}>
        <h3 className={styles.routingDependencyInjectionIoCSectionHeading}>
          <Icons.Box className={styles.routingElement} />
          Dependency Injection (IoC) Lifetimes in Minimal APIs
        </h3>
        <p className={styles.routingInMinimalAPIsDescription}>
          In Minimal APIs, you don't need constructor injection—simply pass registered services (like <code className={styles.routingDishesDbContextCodeText}>DishesDbContext</code>) directly as parameters to your route handler delegate!
        </p>

        <div className={styles.routingAddTransientEveryRequestGrid}>
          <div className={styles.routingAddTransientEveryRequestContentPanel}>
            <div className={styles.routingAddTransientEveryRequestRow}>
              <span className={styles.routingAddTransientInlineText}>AddTransient&lt;T&gt;()</span>
              <span className={styles.routingEveryRequestContainerBadge}>Every Request to Container</span>
            </div>
            <p className={styles.routingBrandNewInstanceDescription}>
              A brand-new instance is created every single time the service is requested from the container, even multiple times within the same HTTP request.
            </p>
          </div>

          <div className={styles.routingAddScopedPerHTTPContentPanel}>
            <div className={styles.routingAddTransientEveryRequestRow}>
              <span className={styles.routingAddScopedInlineText}>AddScoped&lt;T&gt;()</span>
              <span className={styles.routingPerHTTPRequestBadge}>Per HTTP Request (DbContext)</span>
            </div>
            <p className={styles.routingBrandNewInstanceDescription}>
              One instance is created per HTTP request scope and reused throughout that single request. <code className={styles.routingAddDbContextCodeText}>AddDbContext</code> uses Scoped by default!
            </p>
          </div>

          <div className={styles.routingAddSingletonApplicationLifetimeContentPanel}>
            <div className={styles.routingAddTransientEveryRequestRow}>
              <span className={styles.routingAddSingletonInlineText}>AddSingleton&lt;T&gt;()</span>
              <span className={styles.routingApplicationLifetimeBadge}>Application Lifetime</span>
            </div>
            <p className={styles.routingBrandNewInstanceDescription}>
              Created once on first request and shared across all HTTP requests and threads for the entire lifetime of the web application.
            </p>
          </div>
        </div>
      </div>

      {/* Route Constraints & AmbiguousMatchException Lab */}
      <div className={styles.routingRouteConstraintsAmbiguousGrid}>
        <div className={styles.routingRouteConstraintsAmbiguousContentPanel}>
          <div className={styles.routingRouteConstraintsAmbiguousRow}>
            <h3 className={styles.routingRouteConstraintsAmbiguousSectionHeading}>
              <Icons.GitBranch className={styles.routingElementInfo} />
              Route Constraints & Ambiguous Match Lab
            </h3>
            <label className={styles.routingGuidConstraintFieldLabel}>
              <input
                type="checkbox"
                checked={useConstraint}
                onChange={(e) => setUseConstraint(e.currentTarget.checked)}
                className={styles.routingTextField}
              />
              <span className={styles.routingGuidConstraintInlineText}>:guid Constraint</span>
            </label>
          </div>

          <p className={styles.routingWhatHappensWhenDescription}>
            What happens when you expose both <code className={styles.routingDishesDishIdCodeText}>/dishes/&#123;dishId&#125;</code> and <code className={styles.routingDishesDishIdCodeText}>/dishes/&#123;dishName&#125;</code>? Test with or without the <code className={styles.routingDishesDbContextCodeText}>:guid</code> route constraint!
          </p>

          <div className={styles.routingTestGUIDDishesRow}>
            <button
              onClick={() => setTestParam('d1a2b3c4-1111-4000-8000-000000000001')}
              className={(isGuid ? styles.routingTestGUIDDishesButtonConditional : styles.routingTestGUIDDishesButtonConditionalNeutral)}
            >
              Test GUID (/dishes/d1a2...0001)
            </button>
            <button
              onClick={() => setTestParam('Rendang')}
              className={(!isGuid ? styles.routingTestGUIDDishesButtonConditional : styles.routingTestGUIDDishesButtonConditionalNeutral)}
            >
              Test Name (/dishes/Rendang)
            </button>
          </div>

          <CodeWindow
            title="Route Registration"
            code={
              useConstraint
                ? `// Constrained route resolves ambiguity!
app.MapGet("/dishes/{dishId:guid}", async (DishesDbContext db, Guid dishId) => 
    await db.Dishes.FirstOrDefaultAsync(d => d.Id == dishId));

app.MapGet("/dishes/{dishName}", async (DishesDbContext db, string dishName) => 
    await db.Dishes.FirstOrDefaultAsync(d => d.Name == dishName));`
                : `// WARNING: Both routes match any segment!
app.MapGet("/dishes/{dishId}", async (DishesDbContext db, Guid dishId) => ...);
app.MapGet("/dishes/{dishName}", async (DishesDbContext db, string dishName) => ...);`
            }
          />

          <div className={(!useConstraint ? styles.routingContentPanelConditional : styles.routingContentPanelConditionalSuccess)}>
            {!useConstraint ? (
              <div>
                <div className={styles.routing500InternalServerRow}>
                  <Icons.XCircle className={styles.routingElementVariant2} />
                  500 Internal Server Error: AmbiguousMatchException
                </div>
                <div>The request matched multiple endpoints:</div>
                <div>- HTTP: GET /dishes/&#123;dishId&#125;</div>
                <div>- HTTP: GET /dishes/&#123;dishName&#125;</div>
              </div>
            ) : (
              <div>
                <div className={styles.routing200OKMatchedRow}>
                  <Icons.CheckCircle2 className={styles.routingElementVariant2} />
                  200 OK — Matched: {isGuid ? 'GET /dishes/{dishId:guid}' : 'GET /dishes/{dishName}'}
                </div>
                <div>Bound Parameter: {isGuid ? `Guid dishId = ${testParam}` : `string dishName = "${testParam}"`}</div>
              </div>
            )}
          </div>
        </div>

        {/* Object Cycle Visualizer: Entity vs DTO */}
        <div className={styles.routingWhyShouldnExposeStack}>
          <div>
            <div className={styles.routingRouteConstraintsAmbiguousRow}>
              <h3 className={styles.routingRouteConstraintsAmbiguousSectionHeading}>
                <Icons.RefreshCw className={styles.routingElementWarning} />
                Why You Shouldn't Expose Entities Directly
              </h3>
              <div className={styles.routingRawEntityCycleRow}>
                <button
                  onClick={() => setUseDtoMode(false)}
                  className={(!useDtoMode ? styles.routingRawEntityCycleButtonConditional : styles.routingRawEntityCycleButtonConditionalNeutral)}
                >
                  Raw Entity (Cycle!)
                </button>
                <button
                  onClick={() => setUseDtoMode(true)}
                  className={(useDtoMode ? styles.routingDTOExtensionButtonConditional : styles.routingRawEntityCycleButtonConditionalNeutral)}
                >
                  DTO + Extension
                </button>
              </div>
            </div>

            <p className={styles.routingWhatHappensWhenDescription}>
              When fetching <code className={styles.routingDishesDishIdCodeText}>/dishes/&#123;dishId&#125;/ingredients</code> with <code className={styles.routingDishesDbContextCodeText}>.Include(d =&gt; d.Ingredients)</code>, the many-to-many navigation properties create an infinite loop during JSON serialization!
            </p>

            {!useDtoMode ? (
              <div className={styles.routingSystemTextJsonContainerLayout}>
                <div className={styles.routingSystemTextJsonContentPanel}>
                  <div className={styles.routingSystemTextJsonRow}>
                    <Icons.AlertTriangle className={styles.routingElementDanger} />
                    System.Text.Json.JsonException: A possible object cycle was detected!
                  </div>
                  <div className={styles.routingDishRendangIngredientsRow}>
                    <span className={styles.routingDishRendangBadge}>Dish (Rendang)</span>
                    <span>→</span>
                    <span className={styles.routingDishRendangBadge}>Ingredients[0] (Beef)</span>
                    <span>→</span>
                    <span className={styles.routingDishRendangBadge}>Dishes[0] (Rendang)</span>
                    <span>→</span>
                    <span className={styles.routingINFINITELOOPInlineText}>∞ INFINITE LOOP</span>
                  </div>
                </div>
                <CodeWindow
                  title="Bad: Returning Entity Graph Directly"
                  code={`app.MapGet("/dishes/{dishId:guid}/ingredients", async (DishesDbContext db, Guid dishId) => {
    // Includes Dishes -> Ingredients -> Dishes -> Ingredients...
    return (await db.Dishes.Include(d => d.Ingredients)
        .FirstOrDefaultAsync(d => d.Id == dishId))?.Ingredients;
});`}
                />
              </div>
            ) : (
              <div className={styles.routingSystemTextJsonContainerLayout}>
                <div className={styles.routingCleanOutwardFacingContentPanel}>
                  <div className={styles.routingCleanOutwardFacingRow}>
                    <Icons.CheckCircle2 className={styles.routingElementSuccess} />
                    Clean Outward-Facing Contract (IngredientDto)
                  </div>
                  <div className={styles.routingFlattensManyManyContainerLayout}>
                    Flattens the Many-to-Many relationship into a single <code className={styles.routingAddDbContextCodeText}>DishId</code> property using a zero-dependency <code className={styles.routingDishesDbContextCodeText}>.ToIngredientDtoList(dishId)</code> extension method!
                  </div>
                </div>
                <CodeWindow
                  title="Good: MappingExtensions.cs"
                  code={`public static IngredientDto ToIngredientDto(this Ingredient entity, Guid dishId) =>
    new() {
        Id = entity.Id,
        Name = entity.Name,
        DishId = dishId // No circular Dishes collection!
    };`}
                />
              </div>
            )}
          </div>

          <div className={styles.routingProTipCourseContentPanel}>
            <strong className={styles.routingDishesDishIdCodeText}>Pro Tip from Course:</strong> For small models, manual extension methods are fast and dependency-free. For large enterprise models, use a source-generator library like <strong>Mapperly</strong> for zero runtime overhead.
          </div>
        </div>
      </div>

      {/* 6-Step Parameter Binding Precedence Rules */}
      <div className={styles.routingDependencyInjectionIoCContentPanel}>
        <h3 className={styles.routingDependencyInjectionIoCSectionHeading}>
          <Icons.Filter className={styles.routingElementAccent} />
          Minimal API Parameter Binding Precedence Hierarchy
        </h3>
        <p className={styles.routingWhatHappensWhenDescription}>
          How does ASP.NET Core 10 know where a handler parameter comes from when you omit attributes like <code className={styles.routingFromQueryCodeText}>[FromQuery]</code> or <code className={styles.routingFromQueryCodeText}>[FromServices]</code>? It evaluates rules in this exact order:
        </p>
        <div className={styles.routingGrid}>
          {[
            { rank: "1", name: "Explicit Attributes", ex: "[FromRoute], [FromQuery], [FromHeader], [FromBody], [FromServices]" },
            { rank: "2", name: "Special Types", ex: "HttpContext, HttpRequest, ClaimsPrincipal, CancellationToken, IFormFile" },
            { rank: "3", name: "BindAsync Method", ex: "Custom types implementing a static valid BindAsync method" },
            { rank: "4", name: "String / TryParse", ex: "Bound from Route if parameter name matches template; otherwise Query String!" },
            { rank: "5", name: "DI Services", ex: "Types registered in builder.Services (e.g., DishesDbContext, ILogger)" },
            { rank: "6", name: "Request Body", ex: "Complex DTOs (e.g., DishForCreationDto) deserialized from JSON body" }
          ].map((rule) => (
            <div key={rule.rank} className={styles.routingRuleStack}>
              <div>
                <span className={styles.routingRuleBadge}>
                  Rule #{rule.rank}
                </span>
                <div className={styles.routingContainerLayout}>{rule.name}</div>
              </div>
              <div className={styles.routingContainerLayoutNeutral}>{rule.ex}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  }
}
