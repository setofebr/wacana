import {
  useEffect,
  useReducer,
  useState,
  type DragEvent,
  type KeyboardEvent,
} from 'react';
import { AnimatePresence, motion } from 'motion/react';
import trashIcon from '../../assets/icon/trash.svg';
import { subtlePresence } from '../../lib/motion';
import ButtonOutline from '../ui/ButtonOutline';
import DelayedTooltip from '../ui/DelayedTooltip';
import TaskItem from '../ui/TaskItem';
import EmptyState from './EmptyState';
import WacanaShell from './WacanaShell';

type Task = {
  completed: boolean;
  id: string;
  parentId: string | null;
  text: string;
};

type TaskHistory = {
  future: Task[][];
  past: Task[][];
  present: Task[];
};

type HistoryAction =
  { tasks: Task[]; type: 'apply' } | { type: 'redo' } | { type: 'undo' };

const initialTasks: Task[] = [];

let nextTaskId = initialTasks.length + 1;

function getNextTaskId(tasks: Task[]) {
  let id = `task-${nextTaskId++}`;

  while (tasks.some((task) => task.id === id)) {
    id = `task-${nextTaskId++}`;
  }

  return id;
}

function getRootTasks(tasks: Task[]) {
  return tasks.filter((task) => task.parentId === null);
}

function getChildren(tasks: Task[], parentId: string) {
  return tasks.filter((task) => task.parentId === parentId);
}

function getOrderedTasks(tasks: Task[]) {
  const parentTasks = getRootTasks(tasks);
  const todoTasks = parentTasks.filter((task) => !task.completed);
  const completedTasks = parentTasks.filter((task) => task.completed);

  return [...todoTasks, ...completedTasks].flatMap((parent) => [
    parent,
    ...getChildren(tasks, parent.id),
  ]);
}

type MovePosition = 'before' | 'after';

function getMoveSiblings(tasks: Task[], task: Task) {
  if (task.parentId !== null) return getChildren(tasks, task.parentId);

  return getRootTasks(tasks).filter(
    (candidate) => candidate.completed === task.completed,
  );
}

function canReorderTasks(tasks: Task[], sourceId: string, targetId: string) {
  const source = tasks.find((task) => task.id === sourceId);
  const target = tasks.find((task) => task.id === targetId);

  return Boolean(
    source &&
    target &&
    source.id !== target.id &&
    source.parentId === target.parentId &&
    (source.parentId !== null || source.completed === target.completed),
  );
}

function reorderTasks(
  tasks: Task[],
  sourceId: string,
  targetId: string,
  position: MovePosition,
) {
  if (!canReorderTasks(tasks, sourceId, targetId)) return tasks;

  const source = tasks.find((task) => task.id === sourceId)!;
  const orderedTasks = getOrderedTasks(tasks);
  const movedTaskIds = new Set([
    source.id,
    ...(source.parentId === null
      ? getChildren(tasks, source.id).map((child) => child.id)
      : []),
  ]);
  const movedTasks = orderedTasks.filter((task) => movedTaskIds.has(task.id));
  const remainingTasks = orderedTasks.filter(
    (task) => !movedTaskIds.has(task.id),
  );
  const targetIndex = remainingTasks.findIndex((task) => task.id === targetId);
  const target = remainingTasks[targetIndex];
  const targetGroupSize =
    target.parentId === null
      ? 1 + getChildren(remainingTasks, target.id).length
      : 1;
  const insertIndex =
    targetIndex + (position === 'after' ? targetGroupSize : 0);

  remainingTasks.splice(insertIndex, 0, ...movedTasks);
  return remainingTasks;
}

function removeTaskGroup(tasks: Task[], id: string) {
  const task = tasks.find((candidate) => candidate.id === id);

  if (!task) return tasks;

  if (task.parentId !== null) {
    return tasks.filter((candidate) => candidate.id !== id);
  }

  return tasks.filter(
    (candidate) => candidate.id !== id && candidate.parentId !== id,
  );
}

function historyReducer(
  state: TaskHistory,
  action: HistoryAction,
): TaskHistory {
  if (action.type === 'apply') {
    return {
      past: [...state.past, state.present],
      present: action.tasks,
      future: [],
    };
  }

  if (action.type === 'undo') {
    const previous = state.past.at(-1);

    if (!previous) return state;

    return {
      past: state.past.slice(0, -1),
      present: previous,
      future: [state.present, ...state.future],
    };
  }

  const next = state.future[0];

  if (!next) return state;

  return {
    past: [...state.past, state.present],
    present: next,
    future: state.future.slice(1),
  };
}

function TaskBoard() {
  const [history, dispatch] = useReducer(historyReducer, {
    past: [],
    present: initialTasks,
    future: [],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingOriginal, setEditingOriginal] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [copiedTask, setCopiedTask] = useState<Task | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverTaskId, setDragOverTaskId] = useState<string | null>(null);
  const tasks = history.present;
  const parentTasks = getRootTasks(tasks);
  const todoTasks = parentTasks.filter((task) => !task.completed);
  const completedTasks = parentTasks.filter((task) => task.completed);
  const todoOrderedTasks = todoTasks.flatMap((task) => [
    task,
    ...getChildren(tasks, task.id),
  ]);
  const orderedTasks = getOrderedTasks(tasks);

  const resolveDraft = (currentTasks: Task[]) => {
    if (!editingId) return currentTasks;

    const text = draft.trim();

    // Empty → remove task
    if (!text) {
      return removeTaskGroup(currentTasks, editingId);
    }

    // Filled → save trimmed value
    return currentTasks.map((task) =>
      task.id === editingId ? { ...task, text } : task,
    );
  };

  const applyTasks = (nextTasks: Task[]) => {
    dispatch({ type: 'apply', tasks: nextTasks });
  };

  const stopEditing = () => {
    setEditingId(null);
    setEditingOriginal(null);
    setDraft('');
  };

  const handleCreateTask = () => {
    const currentTasks = resolveDraft(tasks);

    const id = getNextTaskId(currentTasks);
    applyTasks([
      { id, text: '', completed: false, parentId: null },
      ...currentTasks,
    ]);
    setEditingId(id);
    setEditingOriginal(null);
    setDraft('');
  };

  const handleEditTask = (task: Task) => {
    setEditingId(task.id);
    setEditingOriginal(task.text);
    setDraft(task.text);
  };

  const handleCommitTask = () => {
    if (!editingId) return;

    const nextTasks = resolveDraft(tasks);

    applyTasks(nextTasks);
    stopEditing();
  };

  const handleCancelEdit = () => {
    if (editingOriginal === null) dispatch({ type: 'undo' });
    stopEditing();
  };

  const handleDeleteTask = (id: string) => {
    const currentIndex = orderedTasks.findIndex((task) => task.id === id);
    const nextTasks = removeTaskGroup(tasks, id);
    const remainingTasks = getOrderedTasks(nextTasks);
    const nextFocus =
      remainingTasks[Math.min(currentIndex, remainingTasks.length - 1)]?.id;

    applyTasks(nextTasks);
    if (!nextTasks.some((task) => task.id === editingId)) stopEditing();

    if (nextFocus) {
      requestAnimationFrame(() => {
        document
          .querySelector<HTMLElement>(`[data-task-id="${nextFocus}"]`)
          ?.focus();
      });
    }
  };

  const handleToggleCompleted = (id: string) => {
    const selectedTask = tasks.find((task) => task.id === id);

    if (!selectedTask) return;

    const completesGroup =
      selectedTask.parentId === null && !selectedTask.completed;

    applyTasks(
      tasks.map((task) => {
        if (task.id === id) {
          return { ...task, completed: !selectedTask.completed };
        }

        if (completesGroup && task.parentId === id) {
          return { ...task, completed: true };
        }

        return task;
      }),
    );
  };

  const handleToggleSubtask = (id: string) => {
    const selectedTask = tasks.find((task) => task.id === id);

    if (!selectedTask) return;

    if (selectedTask.parentId !== null) {
      applyTasks(
        orderedTasks.map((task) =>
          task.id === id ? { ...task, parentId: null } : task,
        ),
      );
      return;
    }

    const currentIndex = orderedTasks.findIndex((task) => task.id === id);
    const previousRoot = orderedTasks
      .slice(0, currentIndex)
      .reverse()
      .find((task) => task.parentId === null);

    if (!previousRoot || previousRoot.id === id) return;

    applyTasks(
      orderedTasks.map((task) => {
        if (task.id === id || task.parentId === id) {
          return { ...task, parentId: previousRoot.id };
        }

        return task;
      }),
    );
  };

  const handleClearCompleted = () => {
    const completedRootIds = new Set(completedTasks.map((task) => task.id));

    applyTasks(
      tasks.filter(
        (task) =>
          !completedRootIds.has(task.id) &&
          (task.parentId === null || !completedRootIds.has(task.parentId)),
      ),
    );
  };

  const handleCopyTask = (task: Task) => {
    setCopiedTask({ ...task });
  };

  const handlePasteTask = (selectedId: string) => {
    if (!copiedTask) return;

    const selectedIndex = tasks.findIndex((task) => task.id === selectedId);

    if (selectedIndex < 0) return;

    const id = getNextTaskId(tasks);
    const pastedTask: Task = {
      ...copiedTask,
      id,
      completed: false,
    };

    applyTasks([
      ...tasks.slice(0, selectedIndex + 1),
      pastedTask,
      ...tasks.slice(selectedIndex + 1),
    ]);

    requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(`[data-task-id="${id}"]`)?.focus();
    });
  };

  const handleUndo = () => {
    stopEditing();
    dispatch({ type: 'undo' });
  };

  const handleRedo = () => {
    stopEditing();
    dispatch({ type: 'redo' });
  };

  const focusRelativeTask = (id: string, direction: -1 | 1) => {
    const currentIndex = orderedTasks.findIndex((task) => task.id === id);
    const nextTask = orderedTasks[currentIndex + direction];

    document
      .querySelector<HTMLElement>(`[data-task-id="${nextTask?.id}"]`)
      ?.focus();
  };

  const handleMoveTask = (task: Task, direction: -1 | 1) => {
    const siblings = getMoveSiblings(tasks, task);
    const taskIndex = siblings.findIndex((sibling) => sibling.id === task.id);
    const targetTask = siblings[taskIndex + direction];

    if (!targetTask) return;

    const nextTasks = reorderTasks(
      tasks,
      task.id,
      targetTask.id,
      direction < 0 ? 'before' : 'after',
    );

    if (nextTasks === tasks) return;

    applyTasks(nextTasks);
    requestAnimationFrame(() => {
      document
        .querySelector<HTMLElement>(`[data-task-id="${task.id}"]`)
        ?.focus();
    });
  };

  const handleTaskDragStart = (
    event: DragEvent<HTMLDivElement>,
    task: Task,
  ) => {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', task.id);
    setDraggedTaskId(task.id);
  };

  const handleTaskDragOver = (event: DragEvent<HTMLDivElement>, task: Task) => {
    if (!draggedTaskId || !canReorderTasks(tasks, draggedTaskId, task.id)) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setDragOverTaskId(task.id);
  };

  const handleTaskDrop = (event: DragEvent<HTMLDivElement>, task: Task) => {
    const sourceId = event.dataTransfer.getData('text/plain') || draggedTaskId;

    if (!sourceId || !canReorderTasks(tasks, sourceId, task.id)) return;

    event.preventDefault();

    const bounds = event.currentTarget.getBoundingClientRect();
    const position =
      event.clientY < bounds.top + bounds.height / 2 ? 'before' : 'after';
    const nextTasks = reorderTasks(tasks, sourceId, task.id, position);

    if (nextTasks !== tasks) {
      applyTasks(nextTasks);
      requestAnimationFrame(() => {
        document
          .querySelector<HTMLElement>(`[data-task-id="${sourceId}"]`)
          ?.focus();
      });
    }

    setDraggedTaskId(null);
    setDragOverTaskId(null);
  };

  const handleTaskKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    task: Task,
  ) => {
    const target = event.target as HTMLElement;
    const isEditable = target.matches(
      'input, textarea, select, [contenteditable="true"]',
    );

    if (isEditable) return;

    const usesModifier = event.metaKey || event.ctrlKey;
    const key = event.key.toLowerCase();

    if (usesModifier && key === 'c') {
      event.preventDefault();
      handleCopyTask(task);
      return;
    }

    if (usesModifier && key === 'v') {
      if (copiedTask) {
        event.preventDefault();
        handlePasteTask(task.id);
      }
      return;
    }

    if (
      usesModifier &&
      (event.key === 'ArrowUp' || event.key === 'ArrowDown')
    ) {
      event.preventDefault();
      handleMoveTask(task, event.key === 'ArrowUp' ? -1 : 1);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      handleEditTask(task);
      return;
    }

    if (event.key === ' ') {
      event.preventDefault();

      const taskIndex = todoOrderedTasks.findIndex(
        (todoTask) => todoTask.id === task.id,
      );
      const previousTodoTask = todoOrderedTasks[taskIndex - 1];

      handleToggleCompleted(task.id);

      if (!task.completed && previousTodoTask) {
        requestAnimationFrame(() => {
          document
            .querySelector<HTMLElement>(
              `[data-task-id="${previousTodoTask.id}"]`,
            )
            ?.focus();
        });
      }

      return;
    }

    if (
      event.key === 'Delete' ||
      event.key === 'Backspace' ||
      event.key === 'Escape'
    ) {
      event.preventDefault();
      handleDeleteTask(task.id);
      return;
    }

    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      focusRelativeTask(task.id, event.key === 'ArrowUp' ? -1 : 1);
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      if (task.parentId === null) handleToggleSubtask(task.id);
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (task.parentId !== null) handleToggleSubtask(task.id);
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (event: globalThis.KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditable = target?.matches(
        'input, textarea, select, button, [contenteditable="true"]',
      );

      if (isEditable) return;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) handleRedo();
        else handleUndo();
        return;
      }

      if (
        !target?.dataset.taskId &&
        (event.key === 'Enter' || event.key.toLowerCase() === 'n')
      ) {
        event.preventDefault();
        handleCreateTask();
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  });

  const renderTask = (task: Task) => {
    const isSubtask = task.parentId !== null;

    return (
      <motion.div
        key={task.id}
        layout="position"
        layoutId={task.id}
        variants={subtlePresence}
        initial="hidden"
        animate="visible"
        exit="hidden"
        className={isSubtask ? 'pl-8' : ''}
      >
        <TaskItem
          data-task-id={task.id}
          role="listitem"
          draggable={!editingId}
          autoFocus={editingId === task.id}
          checked={task.completed}
          className={`cursor-grab active:cursor-grabbing ${dragOverTaskId === task.id ? 'bg-app-hover' : ''}`}
          editing={editingId === task.id}
          isSubtask={isSubtask}
          label={task.text}
          value={editingId === task.id ? draft : task.text}
          onCancel={handleCancelEdit}
          onCheckedChange={() => handleToggleCompleted(task.id)}
          onDragStart={(event) => handleTaskDragStart(event, task)}
          onDragOver={(event) => handleTaskDragOver(event, task)}
          onDrop={(event) => handleTaskDrop(event, task)}
          onDragEnd={() => {
            setDraggedTaskId(null);
            setDragOverTaskId(null);
          }}
          onDelete={() => handleDeleteTask(task.id)}
          onEdit={() => handleEditTask(task)}
          onKeyDown={(event) => handleTaskKeyDown(event, task)}
          onSave={handleCommitTask}
          onToggleSubtask={() => handleToggleSubtask(task.id)}
          onValueChange={setDraft}
        />
      </motion.div>
    );
  };

  const renderTaskGroup = (parent: Task) => (
    <motion.div
      key={parent.id}
      layout="position"
      variants={subtlePresence}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <AnimatePresence initial={false} mode="popLayout">
        {renderTask(parent)}
        {getChildren(tasks, parent.id).map(renderTask)}
      </AnimatePresence>
    </motion.div>
  );

  if (tasks.length === 0) {
    return (
      <EmptyState
        canRedo={history.future.length > 0}
        canUndo={history.past.length > 0}
        onCreateTask={handleCreateTask}
        onRedo={handleRedo}
        onUndo={handleUndo}
      />
    );
  }

  return (
    <WacanaShell
      canRedo={history.future.length > 0}
      canUndo={history.past.length > 0}
      onCreateTask={handleCreateTask}
      onRedo={handleRedo}
      onUndo={handleUndo}
    >
      <div className="task-scrollbar relative h-120 w-full overflow-y-auto rounded-3xl bg-app-surface p-3 shadow-app-lg">
        <section aria-labelledby="todo-heading">
          <div className="px-3">
            <div className="flex min-h-12 items-center border-b border-app-border">
              <h1
                id="todo-heading"
                className="text-sm font-semibold leading-5 tracking-[0.14px]"
              >
                To do
              </h1>
            </div>
          </div>

          {todoTasks.length === 0 && completedTasks.length > 0 ? (
            <div className="px-3 py-4">
              <p className="text-sm font-medium leading-5 text-app-muted">
                You have completed your tasks, relax...
              </p>
            </div>
          ) : (
            <div role="list">{todoTasks.map(renderTaskGroup)}</div>
          )}
        </section>

        <AnimatePresence initial={false}>
          {completedTasks.length > 0 ? (
            <motion.section
              key="completed"
              layout
              aria-labelledby="completed-heading"
              variants={subtlePresence}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="px-3">
                <div className="flex min-h-12 items-center gap-3 border-b border-app-border">
                  <h2
                    id="completed-heading"
                    className="min-w-0 flex-1 text-sm font-semibold leading-5 tracking-[0.14px]"
                  >
                    Completed
                  </h2>
                  <DelayedTooltip label="Clear completed tasks">
                    <ButtonOutline
                      showLeftIcon={false}
                      rightIcon={trashIcon}
                      rightIconClassName="opacity-60"
                      onClick={handleClearCompleted}
                    >
                      Clear
                    </ButtonOutline>
                  </DelayedTooltip>
                </div>
              </div>
              <div role="list">
                <AnimatePresence initial={false} mode="popLayout">
                  {completedTasks.map(renderTaskGroup)}
                </AnimatePresence>
              </div>
            </motion.section>
          ) : null}
        </AnimatePresence>
      </div>
    </WacanaShell>
  );
}

export default TaskBoard;
