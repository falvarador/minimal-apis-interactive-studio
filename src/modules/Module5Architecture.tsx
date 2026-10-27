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

export class Module5Architecture extends Component<Record<string, never>> {
  private readonly structStage = signal(3);
  private readonly logMode = signal('structured');

  render() {
    const [structStage, setStructStage] = bindSignal(this.structStage);
    const [logMode, setLogMode] = bindSignal(this.logMode);
    
    return (
    <div className={`${styles.architectureNewInNETContainerLayout} ${styles.module}`}>
      {/* .NET 10 Built-In Validation Deep Dive */}
      <div className={styles.architectureNewInNETContentPanel}>
        <div className={styles.architectureNewInNETRow}>
          <div>
            <span className={styles.architectureNewInNETBadge}>
              New in .NET 10!
            </span>
            <h3 className={styles.architectureBuiltInDataSectionHeading}>
              Built-in Data Annotation Validation (<code className={styles.architectureBuilderServicesAddValidationCodeText}>builder.Services.AddValidation()</code>)
            </h3>
            <p className={styles.architectureInOlderASPDescription}>
              In older ASP.NET Core versions, Minimal APIs lacked built-in validation. Now in .NET 10, calling <code className={styles.architectureBuilderServicesAddValidationCodeText}>AddValidation()</code> automatically validates incoming DTOs before your handler code ever runs!
            </p>
          </div>
        </div>

        <div className={styles.architectureWhyUseBothGrid}>
          <CodeWindow
            title="DishForCreationDto.cs — Compiler vs Runtime Check"
            highlightLines={[3, 4, 5]}
            code={`public class DishForCreationDto
{
    [Required] // <-- Runtime Check: Inspected by AddValidation() on HTTP requests
    [StringLength(200, MinimumLength = 2)]
    public required string Name { get; set; } // <-- Compiler Check: C# required modifier
}`}
          />
          <div className={styles.architectureWhyUseBothStack}>
            <div>
              <h4 className={styles.architectureWhyUseBothSectionHeading}>Why Use Both <code className={styles.architectureBuilderServicesAddValidationCodeText}>[Required]</code> and <code className={styles.architectureRequiredCodeText}>required</code>?</h4>
              <ul className={styles.architectureRequiredKeywordEnforcesList}>
                <li className={styles.architectureRequiredKeywordEnforcesListItem}>
                  <Icons.CheckCircle2 className={styles.architectureElement} />
                  <span><strong>C# <code className={styles.architectureRequiredCodeTextVariant2}>required</code> keyword:</strong> Enforces at compile-time that your own C# code initializes the property when constructing the object.</span>
                </li>
                <li className={styles.architectureRequiredKeywordEnforcesListItem}>
                  <Icons.CheckCircle2 className={styles.architectureElementVariant2} />
                  <span><strong><code className={styles.architectureRequiredCodeTextVariant2}>[Required]</code> & <code className={styles.architectureRequiredCodeTextVariant2}>[StringLength]</code> attributes:</strong> Inspected at runtime by <code className={styles.architectureRequiredCodeTextVariant2}>AddValidation()</code> before the route handler executes.</span>
                </li>
                <li className={styles.architectureRequiredKeywordEnforcesListItem}>
                  <Icons.CheckCircle2 className={styles.architectureElementSuccess} />
                  <span><strong>Short-Circuiting:</strong> If validation fails, ASP.NET Core immediately returns a <code className={styles.architectureRequiredCodeTextVariant2}>400 Bad Request</code> ProblemDetails response—your handler never executes!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 3-Stage Architecture Refactoring Visualizer */}
      <div className={styles.architectureNewInNETContentPanel}>
        <div className={styles.architectureNewInNETRow}>
          <div>
            <h3 className={styles.architectureStructuringMinimalAPIsSectionHeading}>
              <Icons.Code2 className={styles.architectureElementVariant3} />
              Structuring Minimal APIs for Scale (3-Stage Evolution)
            </h3>
            <p className={styles.architectureInOlderASPDescription}>
              Click through the 3 refactoring stages from Page 29–31 to see how we transform a cluttered <code className={styles.architectureProgramCsCodeText}>Program.cs</code> into a clean, unit-testable architecture!
            </p>
          </div>
          <div className={styles.architectureRow}>
            {[
              { stage: 1, label: "Stage 1: Local Functions" },
              { stage: 2, label: "Stage 2: Static Handler Classes" },
              { stage: 3, label: "Stage 3: IEndpointRouteBuilder Extensions" }
            ].map((s) => (
              <button
                key={s.stage}
                onClick={() => setStructStage(s.stage)}
                className={(structStage === s.stage ? styles.architectureButtonConditional : styles.architectureButtonConditionalNeutral)}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {structStage === 1 && (
          <CodeWindow
            title="Stage 1: Extracting Lambdas to Local Functions inside Program.cs"
            code={`// Program.cs — Easier to read map calls, but everything is still trapped in one file!
dishesEndpoints.MapGet("", GetDishesAsync);

static async Task<Ok<IEnumerable<DishDto>>> GetDishesAsync(DishesDbContext db, string? name) {
    return TypedResults.Ok((await db.Dishes
        .Where(d => name == null || d.Name.Contains(name))
        .ToListAsync()).ToDishDtoList());
}`}
          />
        )}

        {structStage === 2 && (
          <CodeWindow
            title="Stage 2: EndpointHandlers/DishesHandlers.cs (Testable Static Classes)"
            code={`namespace DishesAPI.EndpointHandlers;

public static class DishesHandlers
{
    public static async Task<Ok<IEnumerable<DishDto>>> GetDishesAsync(
        DishesDbContext dishesDbContext,
        ClaimsPrincipal claimsPrincipal,
        ILogger<DishDto> logger,
        string? name)
    {
        logger.LogInformation("User authenticated? {IsAuthenticated}", 
            claimsPrincipal.Identity?.IsAuthenticated);

        return TypedResults.Ok((await dishesDbContext.Dishes
            .Where(d => name == null || d.Name.Contains(name))
            .ToListAsync()).ToDishDtoList());
    }
}`}
          />
        )}

        {structStage === 3 && (
          <div className={styles.architectureGrid}>
            <CodeWindow
              title="Extensions/EndpointRouteBuilderExtensions.cs"
              code={`public static class EndpointRouteBuilderExtensions
{
    public static void RegisterDishesEndpoints(this IEndpointRouteBuilder app)
    {
        var dishes = app.MapGroup("/dishes").RequireAuthorization();
        var dishById = dishes.MapGroup("/{dishId:guid}");

        dishes.MapGet("", DishesHandlers.GetDishesAsync);
        dishes.MapGet("/{dishName}", DishesHandlers.GetDishByNameAsync)
              .AllowAnonymous();
        dishById.MapGet("", DishesHandlers.GetDishByIdAsync).WithName("GetDish");
        dishes.MapPost("", DishesHandlers.CreateDishAsync);
        dishById.MapPut("", DishesHandlers.UpdateDishAsync);
        dishById.MapDelete("", DishesHandlers.DeleteDishAsync);
    }
}`}
            />
            <CodeWindow
              title="Program.cs (Ultra-Clean Final Result!)"
              highlightLines={[8, 9]}
              code={`var app = builder.Build();

if (!app.Environment.IsDevelopment()) {
    app.UseExceptionHandler();
}
app.UseStatusCodePages();
app.UseHttpsRedirection();

app.RegisterDishesEndpoints();
app.RegisterIngredientsEndpoints();

app.Run();`}
            />
          </div>
        )}
      </div>

      {/* Structured Logging vs String Interpolation */}
      <div className={styles.architectureNewInNETContentPanel}>
        <div className={styles.architectureStructuredLoggingILoggerRow}>
          <h3 className={styles.architectureStructuringMinimalAPIsSectionHeading}>
            <Icons.Terminal className={styles.architectureElementInfo} />
            Structured Logging with <code className={styles.architectureILoggerDishDtoCodeText}>ILogger&lt;DishDto&gt;</code>
          </h3>
          <div className={styles.architectureStructuredTemplateBestRow}>
            <button
              onClick={() => setLogMode('structured')}
              className={(logMode === 'structured' ? styles.architectureStructuredTemplateBestButtonConditional : styles.architectureStructuredTemplateBestButtonConditionalNeutral)}
            >
              Structured Template (Best)
            </button>
            <button
              onClick={() => setLogMode('interpolated')}
              className={(logMode === 'interpolated' ? styles.architectureStringInterpolationAntiButtonConditional : styles.architectureStructuredTemplateBestButtonConditionalNeutral)}
            >
              String Interpolation (Anti-Pattern)
            </button>
          </div>
        </div>

        {logMode === 'structured' ? (
          <div className={styles.architectureInfoDishesAPIModelsGrid}>
            <CodeWindow
              title="Structured Message Template"
              code={`// Preserves {IsAuthenticated} as a queryable key-value property!
logger.LogInformation(
    "Is user authenticated? {IsAuthenticated}", 
    claimsPrincipal.Identity?.IsAuthenticated);`}
            />
            <div className={styles.architectureInfoDishesAPIModelsContentPanel}>
              <div className={styles.architectureInfoDishesAPIModelsContainerLayout}>info: DishesAPI.Models.DishDto[0]</div>
              <div className={styles.architectureProgramCsCodeText}>      Is user authenticated? False</div>
              <div className={styles.architectureParsedJSONPropertyContainerLayout}>
                Parsed JSON Property in App Insights / Seq: <code className={styles.architectureILoggerDishDtoCodeText}>&#123; "IsAuthenticated": false &#125;</code>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.architectureInfoDishesAPIModelsGrid}>
            <CodeWindow
              title="String Interpolation Destroys Structured Fields"
              code={`// BAD: Bakes value into raw string; log aggregators cannot filter by field!
Console.WriteLine($"User authenticated? {claimsPrincipal.Identity?.IsAuthenticated}");`}
            />
            <div className={styles.architectureAvoidConsoleWriteLineContentPanel}>
              ❌ Avoid <code className={styles.architectureRequiredCodeTextVariant2}>Console.WriteLine</code> or <code className={styles.architectureRequiredCodeTextVariant2}>$"..."</code> in <code className={styles.architectureRequiredCodeTextVariant2}>ILogger</code> calls. It bypasses log levels in <code className={styles.architectureRequiredCodeTextVariant2}>appsettings.json</code> and prevents structured querying!
            </div>
          </div>
        )}
      </div>
    </div>
  );
  }
}
