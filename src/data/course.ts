import {
  BookOpen,
  Code2,
  Database,
  GitBranch,
  Layers,
  Shield,
  Zap,
} from 'lucide-preact'
import type { CourseModule, Dish } from '../types'

export const INITIAL_DISHES: Dish[] = [
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
]

export function cloneInitialDishes(): Dish[] {
  return INITIAL_DISHES.map((dish) => ({
    ...dish,
    ingredients: dish.ingredients.map((ingredient) => ({ ...ingredient })),
  }))
}

export const MODULES: CourseModule[] = [
  {
    id: 'intro',
    number: '01',
    title: 'Foundations & HTTP Pipeline',
    subtitle: 'Minimal APIs vs MVC, WebApplicationBuilder & Middleware',
    icon: Layers,
    accent: 'violet',
    badge: 'Pages 1–7',
  },
  {
    id: 'routing',
    number: '02',
    title: 'DI, Routing & DTO Mapping',
    subtitle: 'Lifetimes, Route Constraints, Object Cycles & Parameter Binding',
    icon: GitBranch,
    accent: 'blue',
    badge: 'Pages 7–15',
  },
  {
    id: 'responses',
    number: '03',
    title: 'Responses, TypedResults & Errors',
    subtitle: 'IResult vs TypedResults, Status Codes & RFC 9457 Problem Details',
    icon: Zap,
    accent: 'emerald',
    badge: 'Pages 15–21',
  },
  {
    id: 'crud',
    number: '04',
    title: 'CRUD Lab & MapGroup',
    subtitle: 'Interactive .http Simulator, CreatedAtRoute & Route Groups',
    icon: Database,
    accent: 'amber',
    badge: 'Pages 21–27',
  },
  {
    id: 'architecture',
    number: '05',
    title: 'Validation, Structure & Logging',
    subtitle: '.NET 10 AddValidation(), Handler Refactoring & Structured ILogger',
    icon: Code2,
    accent: 'pink',
    badge: 'Pages 27–33',
  },
  {
    id: 'security',
    number: '06',
    title: 'JWT Security & Policies',
    subtitle: 'dotnet user-jwts Lab, ClaimsPrincipal & RequireAdminFromBelgium',
    icon: Shield,
    accent: 'purple',
    badge: 'Pages 33–39',
  },
  {
    id: 'openapi',
    number: '07',
    title: 'OpenAPI, Scalar UI & Showdown',
    subtitle: 'Built-in OpenAPI, Document Transformers & Final Architecture Matrix',
    icon: BookOpen,
    accent: 'cyan',
    badge: 'Pages 39–44',
  },
]
