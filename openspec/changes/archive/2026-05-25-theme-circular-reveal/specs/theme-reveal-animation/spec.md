## ADDED Requirements

### Requirement: Circular reveal animation on theme toggle
When the user clicks the theme toggle button, the system SHALL animate the transition using a circular clip-path that expands from the button's position outward, instead of a simultaneous CSS transition on all elements.

#### Scenario: Desktop theme toggle
- **WHEN** user clicks the theme toggle button in the desktop sidebar
- **THEN** a circular clip-path animation starts from the button's center coordinates and expands to cover the entire viewport within 500ms
- **THEN** the theme class on `<html>` changes immediately at animation start

#### Scenario: Mobile theme toggle
- **WHEN** user clicks the theme toggle button in the mobile bottom navigation bar
- **THEN** a circular clip-path animation starts from the button's center coordinates and expands to cover the entire viewport within 500ms
- **THEN** the theme class on `<html>` changes immediately at animation start

### Requirement: Animation overlay behavior
The animation SHALL use a fixed-position overlay element with `clip-path: circle()` that covers the full viewport during the transition.

#### Scenario: Overlay appearance
- **WHEN** the animation is active
- **THEN** a full-screen overlay with `position: fixed` and `z-index: 9999` is rendered via Teleport to `<body>`
- **THEN** the overlay uses the previous theme's background color
- **THEN** `pointer-events: none` is set on the overlay to avoid blocking interactions

#### Scenario: Overlay cleanup
- **WHEN** the clip-path animation completes (500ms)
- **THEN** the overlay is removed from the DOM

### Requirement: Prevent animation overlap
The system SHALL prevent multiple concurrent animations when the user clicks the toggle rapidly.

#### Scenario: Rapid double-click
- **WHEN** user clicks the theme toggle while an animation is already in progress
- **THEN** the second click is ignored
- **THEN** only the first animation continues and completes normally

### Requirement: Remove conflicting CSS transitions
The existing CSS `transition` on `body` for `background-color` and `color` SHALL be removed to avoid conflicting with the clip-path animation.

#### Scenario: No CSS transition interference
- **WHEN** the theme changes via the toggle button
- **THEN** no CSS `transition` on `background-color` or `color` is applied to `body` or other global elements
