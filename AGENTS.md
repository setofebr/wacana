# AGENTS.md

## Project

This project is a focused React application.

Primary stack:

- React
- TypeScript
- Vite
- Tailwind CSS
- Motion
- Browser Local Storage

Do not introduce additional libraries or frameworks unless they are necessary for the requested task or explicitly approved.

---

## Development

- ESLint
- Prettier

Do not introduce additional frameworks, state-management libraries,
component libraries, or backend services unless explicitly required.

---

## Source of Truth

Before implementing or modifying UI, inspect the existing project first.

Use the following sources in this order:

1. Explicit user instructions
2. Existing project implementation
3. Project design system and tokens
4. Provided mockups and component states
5. Project documentation
6. General best practices

Do not replace an established project decision with a generic convention unless there is a clear technical reason.

---

## Before Making Changes

Before editing code:

1. Identify the exact behavior or component being changed.
2. Inspect the relevant existing files.
3. Understand how the current implementation works.
4. Check whether an existing component, token, utility, or pattern already solves the problem.
5. Make the smallest change necessary.

Do not modify unrelated parts of the project.

---

## Implementation

Prefer simple, readable implementations.

Use:

- semantic HTML
- existing components
- existing design tokens
- existing utilities
- React state only when state is actually required

Prefer CSS or Tailwind for visual interaction states such as:

- hover
- focus-visible
- active
- disabled

Do not create React state for purely visual states unless necessary.

---

## Components

Reuse existing components before creating new ones.

Create a new component when:

- it is meaningfully reusable,
- it represents a distinct UI responsibility, or
- separating it significantly improves readability.

Avoid premature abstraction.

Do not split components only to make files smaller.

---

## State

Keep state as close as possible to where it is used.

Do not introduce global state management unless the application genuinely requires it.

Prefer derived state over duplicated state.

Avoid storing values in state when they can be calculated from existing state or props.

---

## Styling values

Use values in this order:

1. Existing project design tokens
2. Existing Tailwind design tokens
3. Explicit values from the Figma design

Do not create arbitrary values merely to approximate the mockup.

If a Figma value matches an existing Tailwind token, use the Tailwind token.

---

## Styling

Follow the existing design system.

Do not invent:

- colors
- spacing
- typography
- radius
- shadows
- motion values
- component variants

when an existing token or pattern is available.

Avoid arbitrary Tailwind values when the same value already exists in the design system.

Do not redesign working UI while implementing functionality.

---

## Interaction

Preserve all documented interaction states and keyboard behavior.

Keyboard shortcuts should not trigger while the user is typing inside:

- input
- textarea
- select
- contenteditable

unless that behavior is explicitly intended.

Use `focus-visible` for keyboard focus where appropriate.

Do not remove accessible keyboard behavior in order to simplify implementation.

---

## Motion

Use Motion only when animation helps communicate a state change.

Prefer existing project motion patterns.

Do not add decorative animation unless requested.

High-frequency interactions should remain subtle and fast.

Respect reduced-motion preferences where applicable.

---

## Icons and Assets

Use the project's existing icon and asset library.

All assets inside `src/assets/icon/` are monochrome UI icons. Render them
through the shared `Icon` component rather than `<img>`. Icon assets define
shape only; their color must come from `currentColor` and the owning
component's semantic `text-*` token.

Do not:

- substitute icons with another icon library
- use emoji as interface icons
- redraw existing assets unnecessarily
- use `invert`, `dark:invert`, brightness filters, or separate dark-mode icon
  assets for icons from `src/assets/icon/`

Preserve existing SVG behavior such as `currentColor` when applicable.

This rule does not apply to logos, illustrations, photographs, or multicolor
assets outside `src/assets/icon/`.

---

## Refactoring

Do not refactor working code unless the refactor is required for the current task.

Do not rename:

- files
- components
- variables
- classes
- tokens

without a clear reason.

Do not replace an implementation merely because another approach appears cleaner.

Prefer targeted improvements over broad rewrites.

---

## Dependencies

Before adding a dependency:

1. Check whether the project already provides the required functionality.
2. Check whether the browser or React can solve it simply.
3. Only add the dependency if it materially simplifies the implementation.

Never install a package for a trivial utility.

---

## Error Handling

Do not silently ignore errors.

Handle expected failure states explicitly.

Avoid adding defensive code for impossible or unsupported scenarios unless there is evidence it is needed.

---

## Verification

After making a change, verify the relevant behavior.

Check:

- default state
- hover
- focus
- active
- disabled
- empty state
- relevant keyboard interactions
- affected responsive states
- relevant motion behavior

Only verify states that apply to the changed component or feature.

Do not claim something is verified if it was not inspected or tested.

---

## Scope Discipline

When the request is small, keep the change small.

Examples:

If asked to change a hover style:

- do not refactor the component architecture.

If asked to add keyboard behavior:

- do not redesign the component.

If asked to adjust motion:

- do not modify unrelated styling.

Solve the requested problem first.

---

## When Something Is Unclear

Do not guess when a decision would introduce a new product, interaction, or design pattern.

Prefer preserving the existing behavior.

If implementation can safely proceed using an established project pattern, use that pattern.

If the ambiguity materially affects the product behavior or design, surface it instead of inventing a decision.
