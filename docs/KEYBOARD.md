# Keyboard

This document defines keyboard behavior for the application.

Keyboard behavior is part of the product specification.
Do not introduce additional shortcuts without updating this document.

---

## Principles

Keyboard actions depend on the current application context.

The same key may perform a different action depending on whether:

- no task is selected
- a task is selected
- a task is being edited

Do not trigger application shortcuts while the user is typing inside:

- input
- textarea
- select
- contenteditable

unless the shortcut is explicitly defined for the editing state.

When an application shortcut is handled, prevent the browser's default
behavior when necessary.

---

## Modifier Key

`Mod` represents:

- `Command` on macOS
- `Ctrl` on Windows and Linux

The UI may display the platform-appropriate key.

---

# No Task Selected

| Key                | Action          |
| ------------------ | --------------- |
| `Enter` / `Return` | Create new task |
| `N`                | Create new task |

Creating a task should move the new task into the appropriate editing state
and focus the task editor.

---

# Task Selected

Only one task may be selected at a time.

| Key                | Action                                |
| ------------------ | ------------------------------------- |
| `Enter` / `Return` | Edit selected task                    |
| `Delete`           | Delete selected task                  |
| `Escape`           | Delete selected task                  |
| `Space`            | Toggle task completion                |
| `Mod + C`          | Copy selected task                    |
| `Mod + V`          | Paste copied task below selected task |
| `Arrow Up`         | Select previous task                  |
| `Arrow Down`       | Select next task                      |
| `Arrow Right`      | Convert task to subtask               |
| `Arrow Left`       | Convert subtask to task               |

Keyboard navigation must preserve the visual selected state.

When selection reaches the first or last available task, do not move beyond
the list boundary.

`Space` and arrow navigation should prevent page scrolling when consumed by
the application.

When `Space` completes an incomplete task, keyboard selection moves to the
nearest task above it in the current **To do** order, when one exists.
Uncompleting a task does not move the selection.

---

# Task Editing

When a task is being edited, normal text input behavior takes precedence over
global application shortcuts.

| Key      | Action      |
| -------- | ----------- |
| `Enter`  | Save task   |
| `Escape` | Cancel edit |

Saving exits editing mode.

Canceling restores the value from before editing began.

Do not trigger task navigation, task creation, or task deletion shortcuts
while editing.

---

# History

| Key               | Action |
| ----------------- | ------ |
| `Mod + Z`         | Undo   |
| `Mod + Shift + Z` | Redo   |

Application-level undo and redo apply when focus is outside an editable text
field.

While editing text, native browser text undo/redo should take precedence
unless explicitly changed by the product specification.

History should support relevant task operations such as:

- create
- delete
- edit
- complete
- task to subtask
- subtask to task

---

# Focus and Selection

Focus and task selection are related but not identical.

Browser focus should remain accessible and visible for keyboard users.

Application selection determines which task receives task-level keyboard
actions.

Do not remove browser focus styling solely because the application has a
selected state.

---

# Shortcut Handling

Prefer one centralized keyboard shortcut handler rather than independent
global `keydown` listeners inside individual components.

Components may handle keyboard input locally when the behavior belongs
specifically to that component, such as task editing.

Global keyboard behavior should remain predictable and should not depend on
which visual child element currently has focus.

---

# Verification

When keyboard behavior changes, verify:

- no task selected
- task selected
- task editing
- completed task selected
- first task in list
- last task in list
- editable fields
- undo
- redo
- task/subtask conversion

Do not claim a keyboard interaction works unless it has been verified.
