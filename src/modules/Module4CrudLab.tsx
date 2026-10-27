import { Component } from 'preact';
import { signal, type Signal } from '@preact/signals';
import styles from './labs.module.css';
import * as Icons from 'lucide-preact';
import type { ApiResponse, Dish, StateUpdater } from '../types';
import { INITIAL_DISHES } from '../data/course';

function bindSignal<T>(target: Signal<T>): [T, (next: StateUpdater<T>) => void] {
  return [target.value, (next) => {
    target.value = typeof next === 'function'
      ? (next as (previous: T) => T)(target.value)
      : next;
  }];
}

interface CrudLabProps {
  dishes: Dish[];
  setDishes: (next: StateUpdater<Dish[]>) => void;
  resetDatabase: () => void;
}

export class Module4CrudLab extends Component<CrudLabProps> {
  private readonly selectedReq = signal('GET_ALL');
  private readonly queryFilter = signal('Mussels');
  private readonly postName = signal('Hawaiian Pizza');
  private readonly putName = signal('Spicy Beef Rendang');
  private readonly targetGuid = signal(INITIAL_DISHES[0].id);
  private readonly lastResponse = signal<ApiResponse | null>(null);

  render() {
    const [selectedReq, setSelectedReq] = bindSignal(this.selectedReq);
    const [queryFilter, setQueryFilter] = bindSignal(this.queryFilter);
    const [postName, setPostName] = bindSignal(this.postName);
    const [putName, setPutName] = bindSignal(this.putName);
    const [targetGuid, setTargetGuid] = bindSignal(this.targetGuid);
    const [lastResponse, setLastResponse] = bindSignal(this.lastResponse);
    const { dishes, setDishes, resetDatabase } = this.props;
    const executeRequest = () => {
    if (selectedReq === 'GET_ALL') {
      const list = dishes.map(d => ({ id: d.id, name: d.name }));
      setLastResponse({
        status: "200 OK",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: list
      });
    } else if (selectedReq === 'GET_FILTER') {
      const list = dishes
        .filter(d => !queryFilter || d.name.toLowerCase().includes(queryFilter.toLowerCase()))
        .map(d => ({ id: d.id, name: d.name }));
      setLastResponse({
        status: "200 OK",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: list
      });
    } else if (selectedReq === 'GET_BY_ID') {
      const found = dishes.find(d => d.id === targetGuid);
      if (!found) {
        setLastResponse({
          status: "404 Not Found",
          headers: { "Content-Type": "application/problem+json" },
          body: { type: "https://tools.ietf.org/html/rfc9110#section-15.5.5", title: "Not Found", status: 404 }
        });
      } else {
        setLastResponse({
          status: "200 OK",
          headers: { "Content-Type": "application/json; charset=utf-8" },
          body: { id: found.id, name: found.name }
        });
      }
    } else if (selectedReq === 'POST_DISH') {
      if (!postName || postName.trim().length < 2) {
        setLastResponse({
          status: "400 Bad Request",
          headers: { "Content-Type": "application/problem+json" },
          body: {
            type: "https://tools.ietf.org/html/rfc9110#section-15.5.1",
            title: "One or more validation errors occurred.",
            status: 400,
            errors: { Name: ["The field Name must be a string with a minimum length of 2 and a maximum length of 200."] }
          }
        });
        return;
      }
      const newId = `d1a2b3c4-${Math.floor(1000 + Math.random() * 9000)}-4000-8000-000000000099`;
      const newDish = { id: newId, name: postName.trim(), ingredients: [] };
      setDishes(prev => [...prev, newDish]);
      setTargetGuid(newId);
      setLastResponse({
        status: "201 Created",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Location": `https://localhost:7290/dishes/${newId}`
        },
        body: { id: newId, name: newDish.name }
      });
    } else if (selectedReq === 'PUT_DISH') {
      const exists = dishes.find(d => d.id === targetGuid);
      if (!exists) {
        setLastResponse({
          status: "404 Not Found",
          headers: { "Content-Type": "application/problem+json" },
          body: { title: "Not Found", status: 404 }
        });
        return;
      }
      setDishes(prev => prev.map(d => d.id === targetGuid ? { ...d, name: putName } : d));
      setLastResponse({
        status: "204 No Content",
        headers: {},
        body: null
      });
    } else if (selectedReq === 'DELETE_DISH') {
      const exists = dishes.find(d => d.id === targetGuid);
      if (!exists) {
        setLastResponse({
          status: "404 Not Found",
          headers: { "Content-Type": "application/problem+json" },
          body: { title: "Not Found", status: 404 }
        });
        return;
      }
      setDishes(prev => prev.filter(d => d.id !== targetGuid));
      setLastResponse({
        status: "204 No Content",
        headers: {},
        body: null
      });
    }
  };

    return (
    <div className={`${styles.crudInteractiveDishesAPIHttpContainerLayout} ${styles.module}`}>
      {/* Live Visual Studio .http File Runner */}
      <div className={styles.crudInteractiveDishesAPIHttpContentPanel}>
        <div className={styles.crudInteractiveDishesAPIHttpRow}>
          <div>
            <h3 className={styles.crudInteractiveDishesAPIHttpSectionHeading}>
              <Icons.Terminal className={styles.crudElement} />
              Interactive <code className={styles.crudDishesAPIHttpCodeText}>DishesAPI.http</code> Playground & Live SQLite State
            </h3>
            <p className={styles.crudTestGETPOSTDescription}>
              Test GET, POST (<code className={styles.crudCreatedAtRouteCodeText}>CreatedAtRoute</code> with named route <code className={styles.crudGetDishCodeText}>"GetDish"</code>), PUT (<code className={styles.crudDishesAPIHttpCodeText}>204 No Content</code>), and DELETE against our live in-memory database!
            </p>
          </div>
          <button
            onClick={() => {
              resetDatabase();
              setTargetGuid(INITIAL_DISHES[0].id);
              setLastResponse(null);
            }}
            className={styles.crudReSeedDishesButton}
          >
            <Icons.RefreshCw className={styles.crudElementVariant2} />
            Re-seed Dishes.db (EnsureDeleted + Migrate)
          </button>
        </div>

        <div className={styles.crudBaseUrlHttpsLocalhostGrid}>
          {/* Left: .http Request Selector */}
          <div className={styles.crudBaseUrlHttpsLocalhostContainerLayout}>
            <div className={styles.crudRow}>
              {[
                { id: 'GET_ALL', label: 'GET /dishes', verb: 'GET' },
                { id: 'GET_FILTER', label: 'GET /dishes?name=', verb: 'GET' },
                { id: 'GET_BY_ID', label: 'GET /dishes/{id}', verb: 'GET' },
                { id: 'POST_DISH', label: 'POST /dishes', verb: 'POST' },
                { id: 'PUT_DISH', label: 'PUT /dishes/{id}', verb: 'PUT' },
                { id: 'DELETE_DISH', label: 'DELETE /dishes/{id}', verb: 'DELETE' },
              ].map((req) => (
                <button
                  key={req.id}
                  onClick={() => setSelectedReq(req.id)}
                  className={styles.requestTab}
                  data-verb={req.verb}
                  data-selected={selectedReq === req.id}
                >
                  {req.label}
                </button>
              ))}
            </div>

            {/* Dynamic Inputs for Request */}
            <div className={styles.crudBaseUrlHttpsLocalhostContentPanel}>
              <div className={styles.crudBaseUrlHttpsLocalhostContainerLayoutNeutral}>@baseUrl = https://localhost:7290</div>
              <div className={styles.crudBaseUrlHttpsLocalhostContainerLayoutNeutral}>###</div>

              {selectedReq === 'GET_ALL' && (
                <div className={styles.crudGETBaseUrlDishesContainerLayout}>GET &#123;&#123;baseUrl&#125;&#125;/dishes</div>
              )}

              {selectedReq === 'GET_FILTER' && (
                <div className={styles.crudGETBaseUrlDishesContainerLayoutVariant2}>
                  <div className={styles.crudGETBaseUrlDishesContainerLayout}>
                    GET &#123;&#123;baseUrl&#125;&#125;/dishes?name={queryFilter}
                  </div>
                  <div className={styles.crudQueryStringNameRow}>
                    <span className={styles.crudQueryStringNameInlineText}>Query String <code className={styles.crudNameCodeText}>name</code>:</span>
                    <input
                      type="text"
                      value={queryFilter}
                      onChange={(e) => setQueryFilter(e.currentTarget.value)}
                      aria-label="Filter dishes by name"
                      className={styles.crudFilterDishesByTextField}
                      placeholder="e.g. Mussels or e"
                    />
                  </div>
                </div>
              )}

              {(selectedReq === 'GET_BY_ID' || selectedReq === 'PUT_DISH' || selectedReq === 'DELETE_DISH') && (
                <div className={styles.crudGETBaseUrlDishesContainerLayoutVariant2}>
                  <div className={styles.crudTargetDishGUIDRow}>
                    <span className={styles.crudQueryStringNameInlineText}>Target Dish GUID:</span>
                    <select
                      value={targetGuid}
                      onChange={(e) => setTargetGuid(e.currentTarget.value)}
                      aria-label="Target dish GUID"
                      className={styles.crudTargetDishGUIDSelect}
                    >
                      {dishes.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.id.slice(0, 13)}...)</option>
                      ))}
                      <option value="00000000-0000-0000-0000-000000000000">Non-existent GUID (Trigger 404)</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedReq === 'POST_DISH' && (
                <div className={styles.crudGETBaseUrlDishesContainerLayoutVariant2}>
                  <div className={styles.crudPOSTBaseUrlDishesContainerLayout}>POST &#123;&#123;baseUrl&#125;&#125;/dishes</div>
                  <div className={styles.crudGetDishCodeText}>Content-Type: application/json</div>
                  <div className={styles.crudQueryStringNameRow}>
                    <span className={styles.crudQueryStringNameInlineText}>DishForCreationDto.Name:</span>
                    <input
                      type="text"
                      value={postName}
                      onChange={(e) => setPostName(e.currentTarget.value)}
                      aria-label="Dish name to create"
                      className={styles.crudFilterDishesByTextField}
                    />
                  </div>
                  <pre className={styles.crudCodeText}>
{`{\n  "name": "${postName}"\n}`}
                  </pre>
                </div>
              )}

              {selectedReq === 'PUT_DISH' && (
                <div className={styles.crudGETBaseUrlDishesContainerLayoutVariant2}>
                  <div className={styles.crudPUTBaseUrlDishesContainerLayout}>PUT &#123;&#123;baseUrl&#125;&#125;/dishes/{targetGuid}</div>
                  <div className={styles.crudGetDishCodeText}>Content-Type: application/json</div>
                  <div className={styles.crudQueryStringNameRow}>
                    <span className={styles.crudQueryStringNameInlineText}>DishForUpdateDto.Name:</span>
                    <input
                      type="text"
                      value={putName}
                      onChange={(e) => setPutName(e.currentTarget.value)}
                      aria-label="Dish name to update"
                      className={styles.crudFilterDishesByTextField}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={executeRequest}
                className={styles.crudSendRequestVisualButton}
              >
                <Icons.Play className={styles.crudElementVariant3} />
                Send Request (Visual Studio .http Runner)
              </button>
            </div>

            {/* Live Database Table */}
            <div className={styles.crudCurrentSQLiteDishesContentPanel}>
              <div className={styles.crudCurrentSQLiteDishesRow}>
                <span>Current SQLite Dishes Table ({dishes.length} rows)</span>
                <span className={styles.crudDishesDbContextDishesInlineText}>DishesDbContext.Dishes</span>
              </div>
              <div className={styles.crudContainerLayout}>
                {dishes.map((d) => (
                  <div key={d.id} className={styles.crudRowNeutral}>
                    <span className={styles.crudInlineText}>{d.name}</span>
                    <span className={styles.crudInlineTextNeutral}>{d.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Response Output & CreatedAtRoute Explanation */}
          <div className={styles.crudResponseOutputHowStack}>
            <div className={styles.crudResponseOutputStack}>
              <div className={styles.crudResponseOutputRow}>
                <span className={styles.crudResponseOutputInlineText}>Response Output</span>
                {lastResponse && (
                  <span className={(lastResponse.status.startsWith('2') ? styles.crudBadgeConditional : styles.crudBadgeConditionalDanger)}>
                    {lastResponse.status}
                  </span>
                )}
              </div>
              <div className={styles.crudRowVariant2}>
                {!lastResponse ? (
                  <div className={styles.crudClickSendRequestRow}>
                    Click "Send Request" to inspect status code, Location headers, and JSON payload!
                  </div>
                ) : (
                  <div className={styles.crudContainerLayoutVariant2}>
                    {Object.entries(lastResponse.headers).map(([k, v]) => (
                      <div key={k} className={styles.crudContainerLayoutInfo}>
                        <span className={styles.crudQueryStringNameInlineText}>{k}:</span> {v}
                      </div>
                    ))}
                    <pre className={styles.crudCodeTextSuccess}>
                      {lastResponse.body ? JSON.stringify(lastResponse.body, null, 2) : '// 204 No Content (Empty Body)'}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.crudHowCreatedAtRouteGeneratesContentPanel}>
              <div className={styles.crudPOSTBaseUrlDishesContainerLayout}>How CreatedAtRoute Generates Links:</div>
              <p className={styles.crudByChainingWithNameDescription}>
                By chaining <code className={styles.crudGetDishCodeText}>.WithName("GetDish")</code> onto <code className={styles.crudMapGetDishesDishIdCodeText}>MapGet("/dishes/&#123;dishId:guid&#125;")</code>, our POST handler calls <code className={styles.crudCreatedAtRouteCodeText}>TypedResults.CreatedAtRoute(dishDto, "GetDish", new &#123; dishId = dishDto.Id &#125;)</code> to automatically populate the <code className={styles.crudGetDishCodeText}>Location</code> header!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MapGroup Hierarchy Visualizer */}
      <div className={styles.crudInteractiveDishesAPIHttpContentPanel}>
        <h3 className={styles.crudOrganizingSharedPrefixesSectionHeading}>
          <Icons.Layers className={styles.crudElement} />
          Organizing Shared Prefixes with <code className={styles.crudDishesAPIHttpCodeText}>MapGroup()</code>
        </h3>
        <p className={styles.crudInsteadRepeatingDishesDescription}>
          Instead of repeating <code className={styles.crudMapGetDishesDishIdCodeText}>/dishes/&#123;dishId:guid&#125;</code> on every endpoint, we build nested route groups that inherit prefixes, route constraints, authorization rules, and OpenAPI tags!
        </p>
        <div className={styles.crudDishesEndpointsAppMapGroupGrid}>
          <div className={styles.crudDishesEndpointsAppMapGroupContentPanel}>
            <div className={styles.crudDishesEndpointsContainerLayout}>1. dishesEndpoints</div>
            <div className={styles.crudAppMapGroupDishesContainerLayout}>app.MapGroup("/dishes")</div>
            <ul className={styles.crudMapGetGetDishesAsyncMapGetList}>
              <li>• MapGet("", GetDishesAsync)</li>
              <li>• MapGet("/&#123;dishName&#125;", GetDishByNameAsync)</li>
              <li>• MapPost("", CreateDishAsync)</li>
            </ul>
          </div>
          <div className={styles.crudDishWithGuidIdEndpointsDishesEndpointsMapGroupContentPanel}>
            <div className={styles.crudDishWithGuidIdEndpointsContainerLayout}>2. dishWithGuidIdEndpoints</div>
            <div className={styles.crudAppMapGroupDishesContainerLayout}>dishesEndpoints.MapGroup("/&#123;dishId:guid&#125;")</div>
            <ul className={styles.crudMapGetGetDishesAsyncMapGetList}>
              <li>• MapGet("", GetDishByIdAsync).WithName("GetDish")</li>
              <li>• MapPut("", UpdateDishAsync)</li>
              <li>• MapDelete("", DeleteDishAsync)</li>
            </ul>
          </div>
          <div className={styles.crudIngredientsEndpointsDishWithGuidIdEndpointsMapGroupContentPanel}>
            <div className={styles.crudIngredientsEndpointsContainerLayout}>3. ingredientsEndpoints</div>
            <div className={styles.crudAppMapGroupDishesContainerLayout}>dishWithGuidIdEndpoints.MapGroup("/ingredients")</div>
            <ul className={styles.crudMapGetGetDishesAsyncMapGetList}>
              <li>• MapGet("", GetIngredientsAsync)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
  }
}
