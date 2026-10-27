# Modular Native Styles Specification

## Purpose

Mantener la identidad visual y la legibilidad del estudio de referencia con estilos aislados, adaptación a distintos tamaños de pantalla y controles accesibles.

## Requirements

### Requirement: Reference visual identity
The application SHALL preserve the reference dark slate surfaces, module accent colors and gradients, bordered rounded panels, typography hierarchy, code-window presentation, sticky header and desktop sidebar/content arrangement. It SHALL NOT inherit starter-page sizing, light-theme overrides or centered text rules.

#### Scenario: View the desktop course
- **WHEN** the viewport is 1440 CSS pixels wide
- **THEN** the course uses the reference maximum content width of 1280 CSS pixels, with an approximately 3/9 sidebar/content split in the twelve-column layout
- **AND** the seven module colors, active/visited indicators and code highlights remain distinguishable

#### Scenario: Use a light operating-system theme
- **WHEN** the operating system prefers a light color scheme
- **THEN** the course retains the reference dark visual identity rather than adopting the starter's light theme

### Requirement: Isolated and complete styling
Component-specific styles SHALL remain scoped to their intended surface. Shared document rules SHALL be restricted to intentional base styling and design tokens, and every conditional state from the reference SHALL have its intended appearance without depending on an external utility stylesheet.

#### Scenario: Change visual states
- **WHEN** a user changes tabs, request verbs, pipeline steps, response statuses or active modules
- **THEN** the corresponding selected, success, warning, error, disabled and highlighted styles are present
- **AND** similarly named elements elsewhere do not change unintentionally

### Requirement: Responsive course layout
The application SHALL retain the reference responsive transitions at 640, 768 and 1024 CSS pixels while preventing page-level horizontal overflow. Long code, response payloads and the comparison table SHALL remain readable using their own horizontal scrolling areas where needed.

#### Scenario: Use a narrow viewport
- **WHEN** the viewport is 375 CSS pixels wide
- **THEN** navigation and lesson content stack, controls remain reachable, and long URLs, GUIDs and labels do not widen the page
- **AND** code and wide table content can scroll inside their own containers

#### Scenario: Cross reference breakpoints
- **WHEN** the viewport crosses 640, 768 or 1024 CSS pixels
- **THEN** typography, visibility, navigation placement and lab grids switch consistently with the reference's small, medium and large layouts

### Requirement: Accessible controls and motion
The application SHALL preserve native button, input and select interactions, expose accessible names and visible keyboard focus, and communicate selected/disabled states without color alone. Nonessential transitions SHALL respect the user's reduced-motion preference without changing simulator results.

#### Scenario: Navigate by keyboard
- **WHEN** a user tabs through navigation, controls and copy actions
- **THEN** each action has a meaningful accessible name and visible focus
- **AND** disabled boundary controls cannot activate, inputs have associated names, and the active lesson is programmatically identifiable

#### Scenario: Request reduced motion
- **WHEN** reduced motion is enabled
- **THEN** decorative entry animation, scaling and progress transitions are reduced or removed
- **AND** pipeline timing, step labels and final simulation results remain correct
