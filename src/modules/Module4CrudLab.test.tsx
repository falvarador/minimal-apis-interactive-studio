import { fireEvent, render, screen, within } from '@testing-library/preact'
import { describe, expect, it } from 'vitest'
import App from '../app'

const expectedDishSummaries = [
  { id: 'd1a2b3c4-1111-4000-8000-000000000001', name: 'Rendang' },
  { id: 'd1a2b3c4-2222-4000-8000-000000000002', name: 'Mussels with French Fries' },
  { id: 'd1a2b3c4-3333-4000-8000-000000000003', name: 'Waterzooi' },
]

function openCrudLab() {
  render(<App />)
  fireEvent.click(screen.getByRole('button', { name: /04\. CRUD Lab & MapGroup/ }))
}

function sendRequest() {
  fireEvent.click(screen.getByRole('button', { name: /Send Request/ }))
}

function responseBody() {
  const response = screen.getByText('Response Output').parentElement?.parentElement
  return response?.querySelector('pre')?.textContent ?? ''
}

function responseText() {
  const response = screen.getByText('Response Output').parentElement?.parentElement
  return response?.textContent ?? ''
}

describe('CRUD lab', () => {
  it('renders all six requests, the initial dish table, and the MapGroup hierarchy', () => {
    openCrudLab()
    for (const name of [
      'GET /dishes',
      'GET /dishes?name=',
      'GET /dishes/{id}',
      'POST /dishes',
      'PUT /dishes/{id}',
      'DELETE /dishes/{id}',
    ]) {
      expect(screen.getByRole('button', { name })).toBeTruthy()
    }
    expect(screen.getByRole('button', { name: 'GET /dishes' }).getAttribute('data-selected')).toBe('true')
    expect(screen.getByText('Current SQLite Dishes Table (3 rows)')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'GET /dishes?name=' }))
    expect((screen.getByRole('textbox', { name: 'Filter dishes by name' }) as HTMLInputElement).value).toBe('Mussels')
    fireEvent.click(screen.getByRole('button', { name: 'POST /dishes' }))
    expect((screen.getByRole('textbox', { name: 'Dish name to create' }) as HTMLInputElement).value).toBe('Hawaiian Pizza')
    fireEvent.click(screen.getByRole('button', { name: 'PUT /dishes/{id}' }))
    expect((screen.getByRole('textbox', { name: 'Dish name to update' }) as HTMLInputElement).value).toBe('Spicy Beef Rendang')
    fireEvent.click(screen.getByRole('button', { name: 'GET /dishes/{id}' }))
    expect((screen.getByRole('combobox', { name: 'Target dish GUID' }) as HTMLSelectElement).value)
      .toBe(expectedDishSummaries[0].id)
    expect(screen.getByText(/1\. dishesEndpoints/)).toBeTruthy()
    expect(screen.getByText(/2\. dishWithGuidIdEndpoints/)).toBeTruthy()
    expect(screen.getByText(/3\. ingredientsEndpoints/)).toBeTruthy()
  })

  it('returns only dish IDs and names for GET all and an empty filter', () => {
    openCrudLab()
    sendRequest()
    expect(screen.getByText('200 OK')).toBeTruthy()
    expect(responseText()).toContain('Content-Type: application/json; charset=utf-8')
    expect(JSON.parse(responseBody())).toEqual(expectedDishSummaries)

    fireEvent.click(screen.getByRole('button', { name: 'GET /dishes?name=' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Filter dishes by name' }), {
      target: { value: '' },
    })
    sendRequest()
    expect(responseText()).toContain('Content-Type: application/json; charset=utf-8')
    expect(JSON.parse(responseBody())).toEqual(expectedDishSummaries)
  })

  it('returns the correct result for existing and missing IDs', () => {
    openCrudLab()
    fireEvent.click(screen.getByRole('button', { name: 'GET /dishes/{id}' }))
    const target = screen.getByRole('combobox', { name: 'Target dish GUID' })
    fireEvent.change(target, { target: { value: '00000000-0000-0000-0000-000000000000' } })
    sendRequest()
    expect(screen.getByText('404 Not Found')).toBeTruthy()
    expect(responseText()).toContain('Content-Type: application/problem+json')
    expect(JSON.parse(responseBody())).toEqual({
      type: 'https://tools.ietf.org/html/rfc9110#section-15.5.5',
      title: 'Not Found',
      status: 404,
    })

    fireEvent.change(target, { target: { value: 'd1a2b3c4-1111-4000-8000-000000000001' } })
    sendRequest()
    expect(screen.getByText('200 OK')).toBeTruthy()
    expect(JSON.parse(responseBody())).toEqual(expectedDishSummaries[0])
    expect(responseText()).toContain('Content-Type: application/json; charset=utf-8')
  })

  it('filters dishes case-insensitively and returns the matching rows', () => {
    openCrudLab()
    fireEvent.click(screen.getByRole('button', { name: 'GET /dishes?name=' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Filter dishes by name' }), {
      target: { value: 'mUsSeLs' },
    })
    sendRequest()

    expect(screen.getByText('200 OK')).toBeTruthy()
    expect(responseText()).toContain('Content-Type: application/json; charset=utf-8')
    expect(JSON.parse(responseBody())).toEqual([expectedDishSummaries[1]])
    const responsePanel = screen.getByText('Response Output').parentElement?.parentElement
    expect(within(responsePanel!).getByText(/Mussels with French Fries/)).toBeTruthy()
    expect(within(responsePanel!).queryByText(/Rendang/)).toBeNull()
  })

  it('preserves the reference POST validation and mutates the shared dish list', () => {
    openCrudLab()
    fireEvent.click(screen.getByRole('button', { name: 'POST /dishes' }))
    const postName = screen.getByRole('textbox', { name: 'Dish name to create' })
    for (const invalidName of ['', '   ', ' X ']) {
      fireEvent.change(postName, { target: { value: invalidName } })
      sendRequest()
      expect(screen.getByText('400 Bad Request')).toBeTruthy()
      expect(responseText()).toContain('Content-Type: application/problem+json')
      expect(JSON.parse(responseBody())).toEqual({
        type: 'https://tools.ietf.org/html/rfc9110#section-15.5.1',
        title: 'One or more validation errors occurred.',
        status: 400,
        errors: {
          Name: ['The field Name must be a string with a minimum length of 2 and a maximum length of 200.'],
        },
      })
      expect(screen.getByText('Current SQLite Dishes Table (3 rows)')).toBeTruthy()
    }

    fireEvent.change(postName, {
      target: { value: '  Test Dish  ' },
    })
    sendRequest()
    expect(screen.getByText('201 Created')).toBeTruthy()
    const created = JSON.parse(responseBody()) as { id: string; name: string }
    expect(created).toEqual({ id: expect.any(String), name: 'Test Dish' })
    fireEvent.click(screen.getByRole('button', { name: 'GET /dishes/{id}' }))
    expect((screen.getByRole('combobox', { name: 'Target dish GUID' }) as HTMLSelectElement).value).toBe(created.id)
    expect(responseText()).toContain(`Content-Type: application/json; charset=utf-8`)
    expect(responseText()).toContain(`Location: https://localhost:7290/dishes/${created.id}`)
    expect(screen.getByText('Test Dish')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'POST /dishes' }))
    const overLimitName = 'A'.repeat(201)
    fireEvent.change(screen.getByRole('textbox', { name: 'Dish name to create' }), {
      target: { value: overLimitName },
    })
    sendRequest()
    expect(screen.getByText('201 Created')).toBeTruthy()
    expect(screen.getByText(overLimitName)).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: /01\. Foundations & HTTP Pipeline/ }))
    fireEvent.click(screen.getByRole('button', { name: /04\. CRUD Lab & MapGroup/ }))
    expect(screen.getByText('Test Dish')).toBeTruthy()
    const responsePanel = screen.getByText('Response Output').parentElement?.parentElement
    expect(within(responsePanel!).getByText(/Click "Send Request"/)).toBeTruthy()
  })

  it('updates and deletes the selected item, then re-seeds the shared collection', () => {
    openCrudLab()
    fireEvent.click(screen.getByRole('button', { name: 'PUT /dishes/{id}' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Dish name to update' }), {
      target: { value: '' },
    })
    sendRequest()
    expect(screen.getAllByText('204 No Content')).toHaveLength(2)
    expect(screen.queryByText('Rendang')).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Re-seed Dishes.db (EnsureDeleted + Migrate)' }))
    expect(screen.getByText('Rendang')).toBeTruthy()
    const responsePanel = screen.getByText('Response Output').parentElement?.parentElement
    expect(within(responsePanel!).getByText(/Click "Send Request"/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'GET /dishes/{id}' }))
    expect((screen.getByRole('combobox', { name: 'Target dish GUID' }) as HTMLSelectElement).value)
      .toBe(expectedDishSummaries[0].id)

    fireEvent.click(screen.getByRole('button', { name: 'DELETE /dishes/{id}' }))
    sendRequest()
    expect(screen.getAllByText('204 No Content')).toHaveLength(2)
    expect(responseBody()).toContain('// 204 No Content (Empty Body)')
    expect(responseText()).not.toContain('Content-Type:')
    expect(screen.queryByText('Rendang')).toBeNull()
  })

  it('preserves untrimmed PUT values and reports missing update and delete targets', () => {
    openCrudLab()
    fireEvent.click(screen.getByRole('button', { name: 'PUT /dishes/{id}' }))
    fireEvent.change(screen.getByRole('textbox', { name: 'Dish name to update' }), {
      target: { value: '  Updated Dish  ' },
    })
    fireEvent.change(screen.getByRole('combobox', { name: 'Target dish GUID' }), {
      target: { value: '00000000-0000-0000-0000-000000000000' },
    })
    sendRequest()
    expect(screen.getByText('404 Not Found')).toBeTruthy()
    expect(JSON.parse(responseBody())).toEqual({ title: 'Not Found', status: 404 })
    expect(responseText()).toContain('Content-Type: application/problem+json')

    fireEvent.change(screen.getByRole('combobox', { name: 'Target dish GUID' }), {
      target: { value: 'd1a2b3c4-1111-4000-8000-000000000001' },
    })
    sendRequest()
    expect(screen.getAllByText(/Updated Dish/).length).toBeGreaterThan(0)
    expect(screen.getAllByText('204 No Content')).toHaveLength(2)
    expect(responseBody()).toContain('// 204 No Content (Empty Body)')
    expect(responseText()).not.toContain('Content-Type:')

    fireEvent.click(screen.getByRole('button', { name: 'DELETE /dishes/{id}' }))
    fireEvent.change(screen.getByRole('combobox', { name: 'Target dish GUID' }), {
      target: { value: '00000000-0000-0000-0000-000000000000' },
    })
    sendRequest()
    expect(screen.getByText('404 Not Found')).toBeTruthy()
    expect(JSON.parse(responseBody())).toEqual({ title: 'Not Found', status: 404 })
    expect(responseText()).toContain('Content-Type: application/problem+json')
  })

  it('can empty and re-seed the collection without resetting course progress', () => {
    openCrudLab()
    fireEvent.click(screen.getByRole('button', { name: 'DELETE /dishes/{id}' }))
    const target = screen.getByRole('combobox', { name: 'Target dish GUID' })
    for (const id of [
      'd1a2b3c4-1111-4000-8000-000000000001',
      'd1a2b3c4-2222-4000-8000-000000000002',
      'd1a2b3c4-3333-4000-8000-000000000003',
    ]) {
      fireEvent.change(target, { target: { value: id } })
      sendRequest()
    }
    expect(screen.getByText('Current SQLite Dishes Table (0 rows)')).toBeTruthy()

    fireEvent.click(screen.getByRole('button', { name: 'GET /dishes' }))
    sendRequest()
    expect(JSON.parse(responseBody())).toEqual([])

    fireEvent.click(screen.getByRole('button', { name: 'Re-seed Dishes.db (EnsureDeleted + Migrate)' }))
    expect(screen.getByText('Current SQLite Dishes Table (3 rows)')).toBeTruthy()
    expect(screen.getByText('Rendang')).toBeTruthy()
    expect(screen.getByText(/Explored/).textContent?.replace(/\s/g, '')).toContain('Explored2of7')
    expect(screen.getByText(/Click "Send Request"/)).toBeTruthy()
  })

  it('keeps dish collections isolated between mounted course instances', () => {
    const firstContainer = document.body.appendChild(document.createElement('div'))
    const secondContainer = document.body.appendChild(document.createElement('div'))
    const first = render(<App />, { container: firstContainer })
    const second = render(<App />, { container: secondContainer })

    fireEvent.click(first.getByRole('button', { name: /04\. CRUD Lab & MapGroup/ }))
    fireEvent.click(second.getByRole('button', { name: /04\. CRUD Lab & MapGroup/ }))
    fireEvent.click(first.getByRole('button', { name: 'POST /dishes' }))
    fireEvent.change(first.getByRole('textbox', { name: 'Dish name to create' }), {
      target: { value: 'First App Dish' },
    })
    fireEvent.click(first.getByRole('button', { name: /Send Request/ }))

    expect(first.getByText('First App Dish')).toBeTruthy()
    expect(second.queryByText('First App Dish')).toBeNull()
    expect(second.getByText('Current SQLite Dishes Table (3 rows)')).toBeTruthy()
  })
})
