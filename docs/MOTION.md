# Motion

This document defines how motion should be used in the application.

Motion communicates state and structural changes.
It should not be added only for decoration.

---

## Source of Truth

If motion behavior is explicitly defined in the design, follow the design.

If no custom motion value is defined, prefer the project's existing Tailwind
transition values rather than creating arbitrary durations or easing curves.

Motion should remain consistent across the application.

---

## CSS vs Motion

Use CSS or Tailwind transitions for simple visual states such as:

- hover
- focus
- active
- disabled
- color changes
- background changes
- border changes
- opacity changes

Use Motion for structural or presence changes such as:

- task creation
- task removal
- task reordering
- task/subtask hierarchy changes
- expanding or collapsing content
- layout changes

Do not use React state or Motion solely to implement hover or focus.

---

# Task Creation

A newly created task may animate into the list.

The animation should communicate that a new item has appeared without
drawing unnecessary attention.

Do not animate the entire task list when one task is created.

Existing tasks may reposition using layout animation when necessary.

---

# Task Deletion

Deleting a task may use an exit animation before it is removed from the DOM.

The animation should remain subtle and should not significantly delay the
user's next action.

After removal, remaining tasks may reposition using layout animation.

---

# Task Reordering

Use layout animation when an existing task changes position.

Examples:

- moving between tasks
- changing hierarchy
- task to subtask
- subtask to task

Avoid manually calculating element positions when Motion layout animation can
handle the transition.

---

# Completion

Completing a task is primarily a state change.

The completed state must remain understandable without animation.

Motion may support:

- checkbox state changes
- icon transitions
- subtle content transitions

Do not rely on motion as the only indication that a task is completed.

---

# Selection

Task selection should respond immediately.

Do not use elaborate Motion animations for keyboard selection.

Visual selected states should primarily use CSS.

---

# Editing

Entering and leaving editing mode should prioritize responsiveness.

Focus, typing, validation, and error states should primarily use CSS.

Do not animate:

- text cursor
- keyboard focus
- validation timing
- input size unnecessarily

Layout animation may be used when multiline content causes the task height to
change.

---

# Hover and Press

Hover behavior belongs to CSS or Tailwind.

Do not use Motion `whileHover` for ordinary component hover states unless
there is an explicit design requirement.

Press feedback may use CSS or Motion when defined by the design system.

Do not add automatic scale effects to every interactive element.

---

# Presence

When using `AnimatePresence`, avoid animating existing content on initial page
load unless the design explicitly includes an initial entrance animation.

Prefer:

`initial={false}`

when presence animation is only intended for changes after the initial
render.

---

# Reduced Motion

Respect `prefers-reduced-motion`.

When reduced motion is enabled:

- preserve the final state
- remove unnecessary transforms
- avoid staged or decorative movement
- keep interaction feedback immediate

Functionality must never depend on an animation completing.

---

# Performance

Prefer animating compositor-friendly properties:

- transform
- opacity

Avoid animating expensive layout properties unless necessary.

Do not add `will-change` by default.

Use it only when an actual rendering issue has been identified.

---

# Consistency

Do not create a new motion pattern for a component when an equivalent pattern
already exists.

Repeated interactions should feel consistent across:

- task creation
- task deletion
- task movement
- checkbox state
- overlays

Project-specific motion patterns take precedence over generic animation
recipes.

---

# Verification

When implementing motion, verify:

- initial render
- enter
- exit
- rapid repeated interactions
- interrupted interactions
- keyboard interactions
- reduced motion
- layout changes

Motion must not block or delay application behavior.
