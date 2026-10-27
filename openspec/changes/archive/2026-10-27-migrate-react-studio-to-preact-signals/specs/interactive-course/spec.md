# Spec Delta

## Purpose

Ofrecer el estudio educativo completo de ASP.NET Core 10 Minimal APIs en el navegador, conservando el contenido y las interacciones del archivo de referencia entregado por el usuario.

## ADDED Requirements

### Requirement: Complete reference content

The application SHALL present all seven reference modules in their original order, with their titles, subtitles, page ranges, explanatory sections, code examples and final comparison matrix. Existing English course content SHALL remain unchanged; framework migration SHALL NOT become a translation, summary or redesign.

#### Scenario: Open the course
- **WHEN** a user opens the application
- **THEN** the course header, seven module navigation entries and the Foundations & HTTP Pipeline module are displayed instead of the starter page
- **AND** the introductory module is the only module initially marked explored

#### Scenario: Read every lesson
- **WHEN** a user visits each module
- **THEN** all corresponding static sections and alternate code examples from the reference are available, including DI lifetimes, parameter binding precedence, MapGroup hierarchy, validation explanations and the final Minimal APIs versus MVC matrix

### Requirement: Navigation and exploration progress

The application SHALL support direct module selection and both pairs of previous/next controls. Progress SHALL count distinct visited modules, beginning at one of seven, without requiring completion actions.

#### Scenario: Visit and revisit a module
- **WHEN** a user selects CRUD and then selects Foundations again
- **THEN** the active content and module header match each selection
- **AND** the explored count remains two of seven without duplicating visits

#### Scenario: Reach the course boundaries
- **WHEN** the user is on the first or last module
- **THEN** both previous controls or both next controls respectively are disabled and cannot navigate beyond the course

### Requirement: Foundations and routing simulators

The application SHALL preserve the architecture selector, template wizard, request pipeline, route constraint demonstration and raw-entity versus DTO demonstration with the reference defaults and outputs.

#### Scenario: Configure the template
- **WHEN** a user switches Minimal API/MVC, toggles controllers or OpenAPI, or selects an authentication option
- **THEN** the corresponding control retains its selected value
- **AND** the generated code changes exactly for the options consumed by the reference; selecting authentication alone does not invent an additional code branch

#### Scenario: Trace a request
- **WHEN** a user sends either provided request URL through the pipeline
- **THEN** step one is selected immediately and the five stages advance at 850 ms intervals
- **AND** the final response is 200 for `/weatherforecast` or 404 for `/`
- **AND** sending again is disabled while tracing, and tracing becomes available again on the reference completion tick after step five

#### Scenario: Change a URL during tracing
- **WHEN** a user changes the request URL while the pipeline is running
- **THEN** the selected stage resets to zero and the existing trace continues using the new selection, without starting an additional timer

#### Scenario: Resolve route ambiguity and object cycles
- **WHEN** a user tests a GUID or name with the route constraint enabled or disabled
- **THEN** the display shows the matching constrained route and bound parameter or the reference ambiguous-match 500 result
- **AND** switching raw entity/DTO selects the corresponding cycle warning or flattened mapping example

### Requirement: Response and architecture demonstrations

The application SHALL preserve all return-type modes, environment/error combinations, architecture stages and structured/interpolated logging examples.

#### Scenario: Inspect typed results and errors
- **WHEN** a user selects any of the three return-type modes
- **THEN** the corresponding code, highlighted lines and compiler/metadata explanation are displayed
- **AND** a 404 without status-code pages displays the empty-body explanation, a 404 with them displays Problem Details, and a 500 displays detailed development or sanitized production output

#### Scenario: Explore architecture and logging
- **WHEN** a user switches among the three structure stages or between structured and interpolated logging
- **THEN** the selected stage and logging mode show the corresponding reference snippets and explanations

### Requirement: Local CRUD request runner

The application SHALL simulate all six request choices against the in-memory dish collection without making API calls. Initial data SHALL include the reference IDs, dish names and ingredients. Responses SHALL preserve status text, headers and body shape from the reference.

#### Scenario: Read and filter dishes
- **WHEN** a user runs GET all, GET filtered or GET by ID
- **THEN** successful results return `200 OK`, the reference JSON content type, and only each dish's `id` and `name`
- **AND** filtering is case-insensitive substring matching, an empty filter returns all dishes, and a missing ID returns the reference `404 Not Found` Problem Details response

#### Scenario: Create a dish
- **WHEN** a user submits a name with at least two characters after trimming
- **THEN** one trimmed dish with an empty ingredient list is appended, its generated ID becomes selected, and the response is `201 Created` with a JSON dish body and `Location` of `https://localhost:7290/dishes/{generated-id}`
- **AND** a blank, whitespace-only or one-character trimmed name returns the reference `400 Bad Request` validation body without changing the collection

#### Scenario: Preserve reference validation boundaries
- **WHEN** a user submits a creation name longer than 200 characters or updates an existing dish to an empty name
- **THEN** the runner preserves the reference behavior: creation is accepted and update succeeds respectively
- **AND** this migration does not add rules merely because a displayed C# annotation describes them

#### Scenario: Update or delete a dish
- **WHEN** a user updates or deletes an existing ID
- **THEN** the collection changes accordingly and the response is `204 No Content` with empty headers and a null body
- **AND** update preserves the supplied name as entered
- **AND** a missing ID returns the reference 404 body without changing the collection

#### Scenario: Reset or exhaust the collection
- **WHEN** a user deletes all dishes
- **THEN** the collection displays zero rows and GET all returns an empty array
- **AND** re-seeding restores exactly the three initial dishes and ingredients, selects the initial target ID and clears the displayed response without resetting course progress

### Requirement: Authorization policy demonstration

The application SHALL simulate token presence, audience, role, country and endpoint selection without generating or validating real credentials.

#### Scenario: Evaluate every authorization branch
- **WHEN** a user changes token settings or endpoint selection
- **THEN** the anonymous name lookup returns 200 even without a token
- **AND** protected endpoints return 401 for a missing token or an audience other than `menu-api`
- **AND** authenticated GET all returns 200 regardless of policy claims
- **AND** POST returns 403 unless role is `admin` and country is `Belgium`, in which case it returns 201
- **AND** the command preview, decoded payload and explanatory result reflect the selected controls

### Requirement: OpenAPI documentation demonstration

The application SHALL preserve endpoint selection, metadata and document-transformer controls, and their reference effects on the simulated Scalar preview.

#### Scenario: Explore documented endpoints
- **WHEN** a user selects GET all, GET by ID or POST
- **THEN** the preview shows the corresponding path, schema and inferred responses
- **AND** toggling metadata controls tags, summaries and the explicit POST validation response
- **AND** toggling the transformer controls the document title, description and authentication block

### Requirement: Code display and clipboard feedback

The application SHALL display the complete trimmed code for each window with line numbers, the original badge and highlighted lines. Copying SHALL copy that same code and expose success only after a successful operation.

#### Scenario: Copy code successfully
- **WHEN** a user copies a code example and the clipboard operation succeeds
- **THEN** the copied text matches the trimmed displayed code
- **AND** the success indicator returns to its normal appearance after 1800 ms

#### Scenario: Clipboard operation fails
- **WHEN** a browser denies or cannot perform the clipboard operation
- **THEN** the code remains available for manual selection and an accessible failure message is shown without a false success indicator
