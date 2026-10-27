# Spec Delta

## Purpose

Preservar una actualización reactiva fiable y la vida útil del estado de la referencia, evitando reinicios por renderizado, contaminación entre instancias y trabajo asíncrono después del desmontaje.

## ADDED Requirements

### Requirement: Stable and isolated application state

The application SHALL retain active module, visited modules and dish collection across ordinary UI updates within one mounted course. Separate mounted course instances SHALL NOT share mutable state. A full reload SHALL restore reference defaults without persistent storage.

#### Scenario: Re-render without losing edits
- **WHEN** a user edits dishes and navigates to another lesson
- **THEN** the shared collection and exploration progress remain unchanged by unrelated UI updates
- **AND** returning to CRUD shows the edited collection

#### Scenario: Mount independent courses
- **WHEN** two course instances are mounted and one instance changes dishes or navigates
- **THEN** the other instance retains its independent initial collection, selection and progress

#### Scenario: Reload the page
- **WHEN** a user reloads after exploring lessons and changing dishes
- **THEN** the course returns to the introductory module, one explored lesson and the original three dishes

### Requirement: Module-local state lifetime

The application SHALL preserve module-local controls while that module is mounted and SHALL restore their reference defaults after navigating away and returning. Code-window feedback SHALL belong to its own window instance.

#### Scenario: Leave and return to a lab
- **WHEN** a user changes a lab's controls, leaves it and returns
- **THEN** those controls return to their reference defaults
- **AND** app-level dish edits and exploration progress are preserved
- **AND** returning to CRUD restores its default request, input fields, initial target and empty response

#### Scenario: Copy independent code windows
- **WHEN** a user copies one of several visible code windows
- **THEN** only that window shows copy feedback and other windows retain their independent state

### Requirement: Consistent derived output

The application SHALL update dependent code previews, response inspectors, progress, policy results and active visual states when their inputs change, without stale or contradictory output.

#### Scenario: Update a control
- **WHEN** a user toggles a constraint, changes a claim, edits a request input or selects a module
- **THEN** every dependent display reflects the latest value without requiring an additional navigation or refresh

#### Scenario: Count explored modules
- **WHEN** another distinct module is visited
- **THEN** the count and visual progress both use the same distinct-visited total out of seven

### Requirement: Bounded asynchronous work

The application SHALL have at most one running pipeline interval per mounted introductory lab and one copy-feedback timeout per code window. Completion, restart and unmount SHALL release obsolete asynchronous work; detached views SHALL NOT continue updating.

#### Scenario: Navigate away during tracing
- **WHEN** a user leaves the introductory module while the pipeline is running
- **THEN** its timer is cancelled and later ticks do not update a detached view
- **AND** revisiting starts with an idle pipeline at step zero

#### Scenario: Copy repeatedly and unmount
- **WHEN** a user copies again before feedback expires
- **THEN** feedback lasts 1800 ms from the latest successful copy without an older timeout clearing it early
- **AND** navigating away cancels outstanding feedback timers

#### Scenario: Clipboard resolves after navigation
- **WHEN** a clipboard promise completes after its code window is unmounted
- **THEN** it does not create feedback timers or update detached UI
