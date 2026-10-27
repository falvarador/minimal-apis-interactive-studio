import { describe, expect, it } from 'vitest'
import { cloneInitialDishes, INITIAL_DISHES, MODULES } from './course'

describe('course reference data', () => {
  it('contains the reference seed and seven ordered modules', () => {
    expect(INITIAL_DISHES).toEqual([
      {
        id: 'd1a2b3c4-1111-4000-8000-000000000001',
        name: 'Rendang',
        ingredients: [
          { id: 'i1', name: 'Beef' },
          { id: 'i2', name: 'Coconut Milk' },
          { id: 'i3', name: 'Lemongrass' },
          { id: 'i4', name: 'Chili' },
        ],
      },
      {
        id: 'd1a2b3c4-2222-4000-8000-000000000002',
        name: 'Mussels with French Fries',
        ingredients: [
          { id: 'i5', name: 'Mussels' },
          { id: 'i6', name: 'Potatoes' },
          { id: 'i7', name: 'Celery' },
          { id: 'i8', name: 'White Wine' },
        ],
      },
      {
        id: 'd1a2b3c4-3333-4000-8000-000000000003',
        name: 'Waterzooi',
        ingredients: [
          { id: 'i9', name: 'Chicken' },
          { id: 'i10', name: 'Carrots' },
          { id: 'i11', name: 'Leeks' },
          { id: 'i12', name: 'Cream' },
        ],
      },
    ])
    expect(MODULES.map(({ id }) => id)).toEqual([
      'intro', 'routing', 'responses', 'crud', 'architecture', 'security', 'openapi',
    ])
    expect(MODULES.map(({ title }) => title)).toEqual([
      'Foundations & HTTP Pipeline',
      'DI, Routing & DTO Mapping',
      'Responses, TypedResults & Errors',
      'CRUD Lab & MapGroup',
      'Validation, Structure & Logging',
      'JWT Security & Policies',
      'OpenAPI, Scalar UI & Showdown',
    ])
    expect(MODULES.map(({ accent }) => accent)).toEqual([
      'violet', 'blue', 'emerald', 'amber', 'pink', 'purple', 'cyan',
    ])
  })

  it('returns independent mutable dish and ingredient copies', () => {
    const first = cloneInitialDishes()
    const second = cloneInitialDishes()
    first[0].name = 'Changed'
    first[0].ingredients[0].name = 'Changed'
    expect(second[0].name).toBe('Rendang')
    expect(second[0].ingredients[0].name).toBe('Beef')
  })
})
