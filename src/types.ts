import type { LucideIcon } from 'lucide-preact'

export interface Ingredient {
  id: string
  name: string
}

export interface Dish {
  id: string
  name: string
  ingredients: Ingredient[]
}

export type ModuleId =
  | 'intro'
  | 'routing'
  | 'responses'
  | 'crud'
  | 'architecture'
  | 'security'
  | 'openapi'

export type ModuleAccent =
  | 'violet'
  | 'blue'
  | 'emerald'
  | 'amber'
  | 'pink'
  | 'purple'
  | 'cyan'

export interface CourseModule {
  id: ModuleId
  number: string
  title: string
  subtitle: string
  icon: LucideIcon
  accent: ModuleAccent
  badge: string
}

export interface CodeWindowProps {
  title: string
  code: string
  highlightLines?: number[]
  badge?: string
}

export interface ApiResponse {
  status: string
  headers: Record<string, string>
  body: unknown
}

export type StateUpdater<T> = T | ((previous: T) => T)
