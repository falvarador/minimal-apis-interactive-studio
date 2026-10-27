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

export class Module6Security extends Component<Record<string, never>> {
  private readonly hasToken = signal(true);
  private readonly audience = signal('menu-api');
  private readonly roleClaim = signal('admin');
  private readonly countryClaim = signal('Belgium');
  private readonly testEndpoint = signal('POST_DISH');

  render() {
    const [hasToken, setHasToken] = bindSignal(this.hasToken);
    const [audience, setAudience] = bindSignal(this.audience);
    const [roleClaim, setRoleClaim] = bindSignal(this.roleClaim);
    const [countryClaim, setCountryClaim] = bindSignal(this.countryClaim);
    const [testEndpoint, setTestEndpoint] = bindSignal(this.testEndpoint);
    
    const evaluateAccess = () => {
    if (testEndpoint === 'GET_BY_NAME') {
      return {
        code: 200,
        status: "200 OK (AllowAnonymous)",
        reason: "This endpoint has .AllowAnonymous(), overriding the group's .RequireAuthorization() rule!"
      };
    }
    if (!hasToken || audience !== 'menu-api') {
      return {
        code: 401,
        status: "401 Unauthorized",
        reason: !hasToken 
          ? "No Bearer token was provided in the Authorization header."
          : `Token audience '${audience}' does not match ValidAudience 'menu-api' in appsettings.json!`
      };
    }
    if (testEndpoint === 'GET_ALL') {
      return {
        code: 200,
        status: "200 OK (Authenticated)",
        reason: "Valid JWT Bearer token! GET /dishes only requires an authenticated user, not the RequireAdminFromBelgium policy."
      };
    }
    // POST_DISH requires RequireAdminFromBelgium policy
    if (roleClaim !== 'admin' || countryClaim !== 'Belgium') {
      return {
        code: 403,
        status: "403 Forbidden",
        reason: `We know who you are (401 passed), but policy 'RequireAdminFromBelgium' failed! Required role='admin' (got '${roleClaim}') AND claim country='Belgium' (got '${countryClaim}').`
      };
    }
    return {
      code: 201,
      status: "201 Created (Policy Satisfied!)",
      reason: "Token is valid AND satisfies both .RequireRole(\"admin\") and .RequireClaim(\"country\", \"Belgium\")!"
    };
  };

    const result = evaluateAccess();

    return (
    <div className={`${styles.securityInteractiveDotnetUserContainerLayout} ${styles.module}`}>
      {/* Interactive dotnet user-jwts CLI + Policy Tester */}
      <div className={styles.securityInteractiveDotnetUserContentPanel}>
        <h3 className={styles.securityInteractiveDotnetUserSectionHeading}>
          <Icons.Shield className={styles.securityElement} />
          Interactive <code className={styles.securityDotnetUserJwtsCodeText}>dotnet user-jwts</code> & Authorization Policy Lab
        </h3>
        <p className={styles.securityConfigureTestJWTDescription}>
          Configure your test JWT claims below and test how ASP.NET Core distinguishes between <strong>401 Unauthorized</strong> (Authentication failure), <strong>403 Forbidden</strong> (Authorization policy failure), and <strong>200/201 Success</strong>!
        </p>

        <div className={styles.securityConfigureTestJWTGrid}>
          {/* Token Builder Controls */}
          <div className={styles.securityConfigureTestJWTContainerLayout}>
            <div className={styles.securityConfigureTestJWTContentPanel}>
              <div className={styles.securityConfigureTestJWTRow}>
                <span className={styles.securityConfigureTestJWTInlineText}>
                  <Icons.Key className={styles.securityElementVariant2} />
                  1. Configure Test JWT Token
                </span>
                <label className={styles.securityIncludeBearerTokenFieldLabel}>
                  <input
                    type="checkbox"
                    checked={hasToken}
                    onChange={(e) => setHasToken(e.currentTarget.checked)}
                    className={styles.securityTextField}
                  />
                  <span className={styles.securityIncludeBearerTokenInlineText}>Include Bearer Token</span>
                </label>
              </div>

              <div className={styles.securityAudienceMenuApiGrid}>
                <div>
                  <label className={styles.securityAudienceFieldLabel}>--audience</label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.currentTarget.value)}
                    disabled={!hasToken}
                    aria-label="JWT audience claim"
                    className={styles.securityJWTAudienceClaimSelect}
                  >
                    <option value="menu-api">menu-api (Valid)</option>
                    <option value="wrong-api">wrong-api (Invalid)</option>
                  </select>
                </div>

                <div>
                  <label className={styles.securityAudienceFieldLabel}>--role</label>
                  <select
                    value={roleClaim}
                    onChange={(e) => setRoleClaim(e.currentTarget.value)}
                    disabled={!hasToken}
                    aria-label="JWT role claim"
                    className={styles.securityJWTAudienceClaimSelect}
                  >
                    <option value="admin">admin</option>
                    <option value="visitor">visitor (No Admin)</option>
                  </select>
                </div>

                <div>
                  <label className={styles.securityAudienceFieldLabel}>--claim country=...</label>
                  <select
                    value={countryClaim}
                    onChange={(e) => setCountryClaim(e.currentTarget.value)}
                    disabled={!hasToken}
                    aria-label="JWT country claim"
                    className={styles.securityJWTAudienceClaimSelect}
                  >
                    <option value="Belgium">Belgium</option>
                    <option value="Netherlands">Netherlands</option>
                  </select>
                </div>
              </div>

              {/* CLI Command Preview */}
              <div className={styles.securityDotnetUserJwtsContentPanel}>
                $ dotnet user-jwts create --audience {audience}
                {roleClaim === 'admin' ? ' --role admin' : ''}
                {countryClaim ? ` --claim country=${countryClaim}` : ''}
              </div>
            </div>

            {/* Decoded jwt.io Payload */}
            <div className={styles.securityDecodedJWTPayloadContentPanel}>
              <div className={styles.securityDecodedJWTPayloadRow}>
                <span>Decoded JWT Payload (jwt.io preview)</span>
                <span className={styles.securityHS256BearerInlineText}>HS256 Bearer</span>
              </div>
              <pre className={styles.securityCodeText}>
{hasToken ? JSON.stringify({
  sub: "Kevin",
  aud: audience,
  role: roleClaim,
  country: countryClaim,
  iss: "dotnet-user-jwts",
  exp: 1893456000
}, null, 2) : "// No Authorization: Bearer <token> header sent"}
              </pre>
            </div>
          </div>

          {/* Right: Endpoint Policy Evaluator */}
          <div className={styles.securitySelectEndpointCallStack}>
            <div className={styles.securitySelectEndpointCallContainerLayout}>
              <div className={styles.securitySelectEndpointCallContentPanel}>
                <div className={styles.securitySelectEndpointCallContainerLayoutNeutral}>
                  2. Select Endpoint to Call
                </div>
                <div className={styles.securityGrid}>
                  {[
                    { id: 'POST_DISH', name: 'POST /dishes', rule: '.RequireAuthorization("RequireAdminFromBelgium")' },
                    { id: 'GET_ALL', name: 'GET /dishes', rule: '.RequireAuthorization() (Any valid token)' },
                    { id: 'GET_BY_NAME', name: 'GET /dishes/Rendang', rule: '.AllowAnonymous() (Public override)' }
                  ].map((ep) => (
                    <button
                      key={ep.id}
                      onClick={() => setTestEndpoint(ep.id)}
                      className={(testEndpoint === ep.id ? styles.securityButtonConditional : styles.securityButtonConditionalNeutral)}
                    >
                      <span className={styles.securityInlineText}>{ep.name}</span>
                      <span className={styles.securityInlineTextAccent}>{ep.rule}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Evaluation Result Box */}
              <div className={(result.code === 200 || result.code === 201 ? styles.securityContentPanelConditional : (result.code === 401 ? styles.securityContentPanelConditionalWarning : styles.securityContentPanelConditionalDanger))}>
                <div className={styles.securityRow}>
                  <span className={styles.securityInlineTextVariant2}>
                    {result.code < 300 ? <Icons.Unlock className={styles.securityElementSuccess} /> : <Icons.Lock className={styles.securityElementDanger} />}
                    {result.status}
                  </span>
                </div>
                <p className={styles.securityDescription}>{result.reason}</p>
              </div>
            </div>

            <CodeWindow
              title="Program.cs — Policy Registration"
              code={`builder.Services.AddAuthentication().AddJwtBearer();
builder.Services.AddAuthorization();
builder.Services.AddAuthorizationBuilder()
    .AddPolicy("RequireAdminFromBelgium", policy =>
        policy
            .RequireRole("admin")
            .RequireClaim("country", "Belgium"));`}
            />
          </div>
        </div>
      </div>
    </div>
  );
  }
}
