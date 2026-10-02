# Design Guidelines

## Purpose

This document defines how design decisions should be interpreted and implemented in this project.

The goal is to preserve the intended design rather than introduce new visual decisions during implementation.

---

## Source of Truth

Use the existing design system, mockups, components, and assets as the primary source of truth.

Before introducing a new visual pattern, check whether an equivalent pattern already exists.

Do not invent design decisions when an existing reference is available.

---

## Design Consistency

Prefer consistency with the existing interface over introducing a locally "better" solution.

Reuse established patterns for:

- spacing
- typography
- colors
- layout
- components
- interaction states
- iconography
- motion

Avoid arbitrary values when an existing token or pattern can be used.

---

## Components

Reuse existing components before creating new ones.

A new component should only be introduced when:

- the pattern appears more than once,
- the behavior is meaningfully reusable, or
- separating it improves readability.

Do not abstract components prematurely.

---

## States

Interactive elements should follow the states defined by the design.

Consider relevant states such as:

- default
- hover
- focus
- active
- selected
- disabled
- loading
- error
- empty

Only implement states that are relevant to the component or specified by the design.

---

## Layout

Preserve the intended visual hierarchy and relationships between elements.

Avoid changing:

- alignment
- spacing relationships
- content hierarchy
- component proportions
- layout behavior

unless required by the design or functionality.

---

## Responsive Behavior

Follow the behavior shown or implied by the provided design.

Prefer layouts that adapt naturally before introducing additional breakpoints or special cases.

Do not invent responsive behavior when the expected behavior is unclear.

---

## Motion

Motion should support interaction and state changes rather than decorate the interface.

Prefer subtle transitions that help users understand:

- appearance and removal
- expansion and collapse
- selection
- reordering
- navigation

Avoid unnecessary animation.

---

## Accessibility

Implementation should preserve both the visual intent and usability.

Use:

- semantic HTML
- keyboard-accessible interactions
- visible focus states
- appropriate labels
- reduced-motion support when applicable

Accessibility improvements should not unnecessarily alter the intended design.

---

## Implementation Principle

When implementing a design:

1. Inspect the existing system first.
2. Reuse existing patterns where possible.
3. Make the smallest necessary visual change.
4. Avoid unrelated redesign or refactoring.
5. Ask before introducing a new design pattern when the intended behavior is ambiguous.
