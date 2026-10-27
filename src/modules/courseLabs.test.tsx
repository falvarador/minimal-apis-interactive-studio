import { act, fireEvent, render, screen } from '@testing-library/preact'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from '../app'

function openModule(number: string, title: string) {
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: new RegExp(`${number}\\. ${title}`) }))
}

function responseInspectorBody() {
  const contentType = screen.getByText(/^Content-Type:/)
  return contentType.parentElement?.querySelector('pre')?.textContent ?? ''
}

afterEach(() => {
  vi.useRealTimers()
})

describe('interactive course labs', () => {
  it('preserves both architecture views and only changes wizard code for consumed options', () => {
    render(<App />)
    const controllers = screen.getByLabelText(/Use controllers/) as HTMLInputElement
    const openApi = screen.getByLabelText(/Enable OpenAPI support/) as HTMLInputElement
    expect(controllers.checked).toBe(false)
    expect(openApi.checked).toBe(false)
    expect(screen.getByText('Direct Route-to-Handler Pipeline')).toBeTruthy()
    expect(screen.queryByText('builder.Services.AddOpenApi();')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'ASP.NET Core MVC' }))
    expect(screen.getByText('Model-View-Controller Triad')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Minimal API' }))
    expect(screen.getByText('Direct Route-to-Handler Pipeline')).toBeTruthy()

    fireEvent.click(controllers)
    expect(screen.getByText('builder.Services.AddControllers(); // <-- MVC Ceremony')).toBeTruthy()
    fireEvent.click(openApi)
    expect(screen.getAllByText('builder.Services.AddOpenApi();').length).toBeGreaterThan(0)
    fireEvent.click(controllers)
    expect(screen.getByText('app.MapGet("/weatherforecast", () => "Hello Minimal API!");')).toBeTruthy()
    expect(screen.getByText('builder.Services.AddOpenApi();')).toBeTruthy()
    fireEvent.click(controllers)
    fireEvent.click(openApi)
    expect(screen.queryByText('builder.Services.AddOpenApi();')).toBeNull()
    fireEvent.click(openApi)
    expect(screen.getAllByText('builder.Services.AddOpenApi();').length).toBeGreaterThan(0)

    const authentication = screen.getByLabelText('Authentication Type') as HTMLSelectElement
    fireEvent.change(authentication, { target: { value: 'MicrosoftIdentity' } })
    expect(authentication.value).toBe('MicrosoftIdentity')
    expect(screen.queryByText(/AddAuthentication/)).toBeNull()
  })

  it('keeps template controls reactive and completes the pipeline on its fifth tick', async () => {
    render(<App />)
    fireEvent.click(screen.getByLabelText(/Use controllers/))
    expect(screen.getByText('builder.Services.AddControllers(); // <-- MVC Ceremony')).toBeTruthy()
    fireEvent.click(screen.getByLabelText(/Enable OpenAPI support/))
    expect(screen.getAllByText('builder.Services.AddOpenApi();').length).toBeGreaterThan(0)

    vi.useFakeTimers()
    const request = screen.getByRole('button', { name: 'Send Request Through Pipeline' })
    fireEvent.click(request)
    expect(screen.getByRole('button', { name: 'Tracing Request...' }).hasAttribute('disabled')).toBe(true)
    await act(async () => { await vi.advanceTimersByTimeAsync(850 * 4) })
    expect(screen.getByRole('button', { name: 'Tracing Request...' }).hasAttribute('disabled')).toBe(true)
    await act(async () => { await vi.advanceTimersByTimeAsync(850) })
    expect(screen.getByRole('button', { name: 'Send Request Through Pipeline' }).hasAttribute('disabled')).toBe(false)
  })

  it('keeps one pipeline timer when the URL changes and cancels it when the module unmounts', async () => {
    vi.useFakeTimers()
    render(<App />)
    const url = screen.getByLabelText('Pipeline request URL')
    fireEvent.click(screen.getByRole('button', { name: 'Send Request Through Pipeline' }))
    expect(vi.getTimerCount()).toBe(1)

    fireEvent.change(url, { target: { value: 'http://localhost:5034/' } })
    fireEvent.change(url, { target: { value: 'http://localhost:5034/weatherforecast' } })
    expect(vi.getTimerCount()).toBe(1)
    await act(async () => { await vi.advanceTimersByTimeAsync(850) })
    expect(screen.getByText('2. UseHttpsRedirection')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Tracing Request...' }).hasAttribute('disabled')).toBe(true)

    fireEvent.click(screen.getByRole('button', { name: /02\. DI, Routing & DTO Mapping/ }))
    expect(vi.getTimerCount()).toBe(0)
    fireEvent.click(screen.getByRole('button', { name: /01\. Foundations & HTTP Pipeline/ }))
    expect(screen.getByRole('button', { name: 'Send Request Through Pipeline' }).hasAttribute('disabled')).toBe(false)
    expect(screen.getByText('1. Incoming Request')).toBeTruthy()
  })

  it('returns the reference status for both pipeline URLs and finishes on the fifth tick', async () => {
    vi.useFakeTimers()
    render(<App />)
    const url = screen.getByLabelText('Pipeline request URL')

    for (const [requestUrl, expectedResponse] of [
      ['http://localhost:5034/', '404 Not Found (Server is alive!)'],
      ['http://localhost:5034/weatherforecast', '200 OK + JSON Payload'],
    ]) {
      fireEvent.change(url, { target: { value: requestUrl } })
      fireEvent.click(screen.getByRole('button', { name: 'Send Request Through Pipeline' }))
      await act(async () => { await vi.advanceTimersByTimeAsync(850 * 4) })
      expect(screen.getByRole('button', { name: 'Tracing Request...' }).hasAttribute('disabled')).toBe(true)
      await act(async () => { await vi.advanceTimersByTimeAsync(850) })
      expect(screen.getByText(expectedResponse)).toBeTruthy()
      expect(screen.getByText('5. Upstream Response')).toBeTruthy()
      expect(screen.getByRole('button', { name: 'Send Request Through Pipeline' }).hasAttribute('disabled')).toBe(false)
    }
  })

  it('shows constrained and ambiguous routes and switches from entities to DTOs', () => {
    openModule('02', 'DI, Routing & DTO Mapping')
    expect(screen.getAllByText(/Rule #/)).toHaveLength(6)
    for (const rule of [
      'Explicit Attributes',
      'Special Types',
      'BindAsync Method',
      'String / TryParse',
      'DI Services',
      'Request Body',
    ]) {
      expect(screen.getByText(rule)).toBeTruthy()
    }
    expect(screen.getByText(/Bound Parameter: Guid dishId/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /Test Name/ }))
    expect(screen.getByText(/Matched: GET \/dishes\/\{dishName\}/)).toBeTruthy()
    expect(screen.getByText('Bound Parameter: string dishName = "Rendang"')).toBeTruthy()
    fireEvent.click(screen.getByLabelText(/:guid Constraint/))
    expect(screen.getByText(/AmbiguousMatchException/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /Test GUID/ }))
    expect(screen.getByText(/AmbiguousMatchException/)).toBeTruthy()
    fireEvent.click(screen.getByLabelText(/:guid Constraint/))
    expect(screen.getByText(/Matched: GET \/dishes\/\{dishId:guid\}/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'DTO + Extension' }))
    expect(screen.getAllByText(/IngredientDto/).length).toBeGreaterThan(0)
    expect(screen.queryByText(/object cycle was detected/)).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: /Raw Entity/ }))
    expect(screen.getByText(/object cycle was detected/)).toBeTruthy()
  })

  it('switches typed results and verifies every environment, error, and status-page response shape', () => {
    openModule('03', 'Responses, TypedResults & Errors')
    fireEvent.click(screen.getByRole('button', { name: /1\. Implicit TypedResults/ }))
    expect(screen.getByText(/CS1593/)).toBeTruthy()
    expect(screen.getByText('Compiler Error: Two Different Concrete Return Types')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /2\. Results\.Ok/ }))
    expect(screen.getByText(/Compiles, but hides metadata/)).toBeTruthy()
    expect(screen.getByText('Workaround: Using Results (Returns IResult Interface)')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /3\. Explicit TypedResults Union/ }))
    expect(screen.getByText(/Compile-Time Safety \+ Automatic OpenAPI Spec/)).toBeTruthy()
    expect(screen.getByText('Best Practice: Explicit Task<Results<T1, T2>> Union Signature')).toBeTruthy()

    const cases = [
      { environment: 'Development', scenario: '404', statusCodePages: true },
      { environment: 'Development', scenario: '404', statusCodePages: false },
      { environment: 'Production', scenario: '404', statusCodePages: true },
      { environment: 'Production', scenario: '404', statusCodePages: false },
      { environment: 'Development', scenario: '500', statusCodePages: true },
      { environment: 'Development', scenario: '500', statusCodePages: false },
      { environment: 'Production', scenario: '500', statusCodePages: true },
      { environment: 'Production', scenario: '500', statusCodePages: false },
    ] as const
    let activeEnvironment = 'Development'
    let activeScenario = '404'
    let statusPagesEnabled = true

    for (const testCase of cases) {
      if (testCase.environment !== activeEnvironment) {
        fireEvent.click(screen.getByRole('button', { name: testCase.environment }))
        activeEnvironment = testCase.environment
      }
      if (testCase.scenario !== activeScenario) {
        fireEvent.click(screen.getByRole('button', {
          name: testCase.scenario === '404' ? /GET \/dishes\/unknown-guid/ : /GET \/testerror/,
        }))
        activeScenario = testCase.scenario
      }
      if (testCase.statusCodePages !== statusPagesEnabled) {
        fireEvent.click(screen.getByRole('checkbox', { name: /app\.UseStatusCodePages/ }))
        statusPagesEnabled = testCase.statusCodePages
      }

      const expectedStatus = testCase.scenario === '404'
        ? 'HTTP/1.1 404 Not Found'
        : 'HTTP/1.1 500 Internal Server Error'
      expect(screen.getByText(expectedStatus)).toBeTruthy()

      if (testCase.scenario === '404' && !testCase.statusCodePages) {
        expect(screen.getByText('Content-Type: None (Empty Body)')).toBeTruthy()
        expect(responseInspectorBody()).toContain('// Empty Response Body!')
      } else {
        expect(screen.getByText('Content-Type: application/problem+json; charset=utf-8')).toBeTruthy()
        const body = JSON.parse(responseInspectorBody())

        if (testCase.scenario === '404') {
          expect(body).toEqual({
            type: 'https://tools.ietf.org/html/rfc9110#section-15.5.5',
            title: 'Not Found',
            status: 404,
          })
        } else if (testCase.environment === 'Development') {
          expect(body).toMatchObject({
            type: 'https://tools.ietf.org/html/rfc9110#section-15.6.1',
            title: 'System.NotImplementedException',
            status: 500,
            detail: 'The method or operation is not implemented.',
          })
          expect(body.exception.details).toContain('Program.cs:line 28')
        } else {
          expect(body).toEqual({
            type: 'https://tools.ietf.org/html/rfc9110#section-15.6.1',
            title: 'An error occurred while processing your request.',
            status: 500,
          })
          expect(body).not.toHaveProperty('detail')
          expect(body).not.toHaveProperty('exception')
        }
      }
    }
  })

  it('switches architecture and logging examples', () => {
    openModule('05', 'Validation, Structure & Logging')
    expect(screen.getByRole('button', { name: /Stage 3: IEndpointRouteBuilder Extensions/ })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /Structured Template/ }))
    expect(screen.getByText(/Preserves \{IsAuthenticated\} as a queryable key-value property/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /Stage 1: Local Functions/ }))
    expect(screen.getByText(/Stage 1: Extracting Lambdas/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /Stage 2: Static Handler Classes/ }))
    expect(screen.getByText(/EndpointHandlers\/DishesHandlers\.cs/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /Stage 3: IEndpointRouteBuilder Extensions/ }))
    expect(screen.getByText(/EndpointRouteBuilderExtensions\.cs/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /String Interpolation/ }))
    expect(screen.getByText(/String Interpolation Destroys Structured Fields/)).toBeTruthy()
  })

  it('evaluates authentication, audience, role, and country claims locally', () => {
    openModule('06', 'JWT Security & Policies')
    expect(screen.getByText(/201 Created \(Policy Satisfied!\)/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /GET \/dishes.*Any valid token/ }))
    expect(screen.getByText(/200 OK \(Authenticated\)/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /GET \/dishes\/Rendang/ }))
    expect(screen.getByText(/200 OK \(AllowAnonymous\)/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /POST \/dishes.*RequireAdminFromBelgium/ }))
    fireEvent.change(screen.getByRole('combobox', { name: 'JWT role claim' }), { target: { value: 'visitor' } })
    expect(screen.getAllByText(/403 Forbidden/)).toHaveLength(2)
    fireEvent.click(screen.getByRole('button', { name: /GET \/dishes.*Any valid token/ }))
    expect(screen.getByText(/200 OK \(Authenticated\)/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /POST \/dishes.*RequireAdminFromBelgium/ }))
    expect(screen.getAllByText(/403 Forbidden/)).toHaveLength(2)
    fireEvent.change(screen.getByRole('combobox', { name: 'JWT role claim' }), { target: { value: 'admin' } })
    fireEvent.change(screen.getByRole('combobox', { name: 'JWT country claim' }), { target: { value: 'Netherlands' } })
    expect(screen.getAllByText(/403 Forbidden/)).toHaveLength(2)
    fireEvent.click(screen.getByRole('button', { name: /GET \/dishes.*Any valid token/ }))
    expect(screen.getByText(/200 OK \(Authenticated\)/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /POST \/dishes.*RequireAdminFromBelgium/ }))
    expect(screen.getAllByText(/403 Forbidden/)).toHaveLength(2)
    fireEvent.change(screen.getByRole('combobox', { name: 'JWT country claim' }), { target: { value: 'Belgium' } })
    fireEvent.click(screen.getByRole('checkbox', { name: /Include/ }))
    expect(screen.getAllByText(/401 Unauthorized/)).toHaveLength(2)
    expect(screen.getByLabelText('JWT audience claim').hasAttribute('disabled')).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: /GET \/dishes\/Rendang/ }))
    expect(screen.getByText(/200 OK \(AllowAnonymous\)/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /POST \/dishes.*RequireAdminFromBelgium/ }))
    expect(screen.getAllByText(/401 Unauthorized/)).toHaveLength(2)
    fireEvent.click(screen.getByRole('checkbox', { name: /Include/ }))
    fireEvent.change(screen.getByRole('combobox', { name: 'JWT audience claim' }), { target: { value: 'wrong-api' } })
    expect(screen.getAllByText(/401 Unauthorized/)).toHaveLength(2)
    expect(screen.getByText(/--audience wrong-api/)).toBeTruthy()
    expect(screen.getByText(/"aud": "wrong-api"/)).toBeTruthy()
  })

  it('updates Scalar metadata, transformer details, and endpoint response docs', () => {
    openModule('07', 'OpenAPI, Scalar UI & Showdown')
    const metadata = screen.getByRole('checkbox', { name: /\.WithTags\(\)/ }) as HTMLInputElement
    const transformer = screen.getByRole('checkbox', { name: /AddDocumentTransformer/ }) as HTMLInputElement

    for (const metadataEnabled of [true, false]) {
      if (metadata.checked !== metadataEnabled) fireEvent.click(metadata)
      for (const transformerEnabled of [true, false]) {
        if (transformer.checked !== transformerEnabled) fireEvent.click(transformer)

        expect(screen.getByRole('heading', {
          name: transformerEnabled ? 'Dishes API' : 'DishesAPI | v1',
        })).toBeTruthy()
        if (transformerEnabled) {
          expect(screen.getByText(/An API for managing dishes and their ingredients/)).toBeTruthy()
          expect(screen.getByText(/Authentication:/)).toBeTruthy()
        } else {
          expect(screen.queryByText(/Injected via Document Transformer/)).toBeNull()
          expect(screen.queryByText(/Authentication:/)).toBeNull()
        }
        expect(screen.getByText(metadataEnabled ? 'TAG: Dishes' : 'Default Group')).toBeTruthy()

        fireEvent.click(screen.getByRole('button', {
          name: metadataEnabled ? /Get all dishes/ : /\/dishesGET/,
        }))
        expect(screen.getByRole('heading', {
          name: metadataEnabled ? 'Get all dishes' : 'Endpoint Details',
        })).toBeTruthy()
        expect(screen.getByText(/200 OK — Schema: DishDto\[\]/)).toBeTruthy()

        fireEvent.click(screen.getByRole('button', {
          name: metadataEnabled ? /Get a dish by ID/ : /\/dishes\/\{dishId\}GET/,
        }))
        expect(screen.getByRole('heading', {
          name: metadataEnabled ? 'Get a dish by ID' : 'Endpoint Details',
        })).toBeTruthy()
        expect(screen.getByText(/200 OK — Schema: DishDto /)).toBeTruthy()
        expect(screen.getByText(/404 Not Found — Inferred/)).toBeTruthy()

        fireEvent.click(screen.getByRole('button', {
          name: metadataEnabled ? /Create a dish/ : /\/dishesPOST/,
        }))
        expect(screen.getByRole('heading', {
          name: metadataEnabled ? 'Create a dish' : 'POST /dishes',
        })).toBeTruthy()
        expect(screen.getByText(/201 Created/)).toBeTruthy()
        if (metadataEnabled) {
          expect(screen.getByText(/Creates a new dish in the database/)).toBeTruthy()
          expect(screen.getByText(/400 Bad Request/)).toBeTruthy()
        } else {
          expect(screen.getByText(/Missing 400 Bad Request in docs/)).toBeTruthy()
        }
      }
    }
  })

  it('resets module-local controls for routing, responses, architecture, security, and OpenAPI', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /02\. DI, Routing & DTO Mapping/ }))
    fireEvent.click(screen.getByRole('button', { name: /Test Name/ }))
    fireEvent.click(screen.getByLabelText(/:guid Constraint/))
    fireEvent.click(screen.getByRole('button', { name: /03\. Responses/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Production' }))
    fireEvent.click(screen.getByRole('button', { name: /GET \/testerror/ }))
    fireEvent.click(screen.getByRole('button', { name: /05\. Validation/ }))
    fireEvent.click(screen.getByRole('button', { name: /Stage 1: Local Functions/ }))
    fireEvent.click(screen.getByRole('button', { name: /String Interpolation/ }))
    fireEvent.click(screen.getByRole('button', { name: /06\. JWT Security/ }))
    fireEvent.change(screen.getByRole('combobox', { name: 'JWT role claim' }), { target: { value: 'visitor' } })
    fireEvent.click(screen.getByRole('button', { name: /07\. OpenAPI/ }))
    fireEvent.click(screen.getByRole('checkbox', { name: /\.WithTags\(\)/ }))
    fireEvent.click(screen.getByRole('checkbox', { name: /AddDocumentTransformer/ }))

    fireEvent.click(screen.getByRole('button', { name: /02\. DI, Routing & DTO Mapping/ }))
    expect((screen.getByLabelText(/:guid Constraint/) as HTMLInputElement).checked).toBe(true)
    expect(screen.getByText(/Bound Parameter: Guid dishId/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /03\. Responses/ }))
    expect(screen.getByText(/HTTP\/1\.1 404 Not Found/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /GET \/testerror/ }))
    expect(
      Array.from(document.querySelectorAll('pre')).some(element =>
        element.textContent?.includes('"detail": "The method or operation is not implemented."'),
      ),
    ).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: /05\. Validation/ }))
    expect(screen.getByRole('button', { name: /Stage 3: IEndpointRouteBuilder Extensions/ })).toBeTruthy()
    expect(screen.getByText(/Preserves \{IsAuthenticated\} as a queryable key-value property/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /06\. JWT Security/ }))
    expect(screen.getByText(/201 Created \(Policy Satisfied!\)/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /07\. OpenAPI/ }))
    expect(screen.getByRole('heading', { name: 'Dishes API' })).toBeTruthy()
    expect(screen.getByText('TAG: Dishes')).toBeTruthy()
  })
})
