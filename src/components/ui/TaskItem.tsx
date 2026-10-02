import {
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type MouseEvent,
} from 'react';
import { AnimatePresence, motion } from 'motion/react';
import chevronRightIcon from '../../assets/icon/chevron-right.svg';
import inputExpanderIcon from '../../assets/icon/input-expander.svg';
import minusIcon from '../../assets/icon/minus.svg';
import Checkbox from './Checkbox';
import DelayedTooltip from './DelayedTooltip';
import Icon from './Icon';
import IconButton from './IconButton';

type TaskItemState =
  | 'default'
  | 'hover'
  | 'disabled'
  | 'typing'
  | 'typing-error'
  | 'typing-filled'
  | 'typing-filled-long';

type TaskItemProps = HTMLAttributes<HTMLDivElement> & {
  autoFocus?: boolean;
  checked?: boolean;
  editing?: boolean;
  isSubtask?: boolean;
  label?: string;
  onCancel?: () => void;
  onCheckedChange?: (checked: boolean) => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onSave?: () => void;
  onToggleSubtask?: () => void;
  onValueChange?: (value: string) => void;
  state?: TaskItemState;
  value?: string;
};

const filledTask = 'Start writing your task dude...';
const longTask =
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.';

function stopActionPropagation(event: MouseEvent<HTMLButtonElement>) {
  event.stopPropagation();
}

function TaskItem({
  autoFocus = false,
  checked = false,
  className = '',
  editing = false,
  isSubtask = false,
  label = 'Task List',
  onCancel,
  onCheckedChange,
  onDelete,
  onEdit,
  onSave,
  onToggleSubtask,
  onValueChange,
  state = 'default',
  tabIndex,
  value,
  ...props
}: TaskItemProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const resizeStartRef = useRef<{
    height: number;
    pointerId: number;
    y: number;
  } | null>(null);
  const [editorCanResize, setEditorCanResize] = useState(false);
  const [manualEditorHeight, setManualEditorHeight] = useState<number | null>(
    null,
  );
  const isDisabled = state === 'disabled';
  const isEditing = editing || state.startsWith('typing');
  const isLongPreview = state === 'typing-filled-long';
  const isFilledPreview = state === 'typing-filled' || isLongPreview;
  const isError = state === 'typing-error';
  const isForcedHover = state === 'hover';
  const editorValue =
    value ?? (isLongPreview ? longTask : isFilledPreview ? filledTask : '');
  const modifierShortcut = /Mac|iPhone|iPad|iPod/i.test(navigator.platform)
    ? [{ type: 'command' as const }]
    : [{ type: 'random' as const, label: 'Ctrl' }];
  const MIN_EDITOR_HEIGHT = 24;
  const RESIZABLE_EDITOR_HEIGHT = 120;
  const MAX_EDITOR_HEIGHT = 280;
  const handleEditorSave = () => {
    setManualEditorHeight(null);
    onSave?.();
  };

  useLayoutEffect(() => {
    const editor = editorRef.current;

    if (!editor || !isEditing) return;
  
    editor.style.height = `${MIN_EDITOR_HEIGHT}px`;
  
    const contentHeight = editor.scrollHeight;
  
    const canResize =
      contentHeight > RESIZABLE_EDITOR_HEIGHT ||
      manualEditorHeight !== null ||
      isLongPreview;
  
    const nextHeight =
      manualEditorHeight ??
      Math.min(contentHeight, RESIZABLE_EDITOR_HEIGHT);
  
    const clampedHeight = Math.min(
      Math.max(nextHeight, MIN_EDITOR_HEIGHT),
      MAX_EDITOR_HEIGHT,
    );
  
    editor.style.height = `${clampedHeight}px`;
  
    editor.style.overflowY =
      contentHeight > clampedHeight ? 'auto' : 'hidden';
  
    setEditorCanResize(canResize);
  }, [
    editorValue,
    isEditing,
    isLongPreview,
    manualEditorHeight,
  ]);

  const containerState = isEditing
    ? `min-h-12 overflow-hidden rounded-2xl bg-app-subtle ${isError ? 'shadow-app-error' : 'shadow-app-typing'} ${isLongPreview ? 'min-h-[48px]' : ''}`
    : isForcedHover
      ? 'min-h-12 rounded-2xl bg-app-hover'
      : isDisabled
        ? 'min-h-[49px] rounded-2xl'
        : 'group/task min-h-[49px] rounded-2xl transition-colors hover:bg-app-hover focus-visible:outline-2 focus-visible:outline-[var(--color-primary-tone-100)] focus-visible:outline-offset-2 focus-visible:shadow-app-focus';

  const labelState = isDisabled
    ? 'text-app-disabled opacity-60'
    : checked
      ? 'text-app-muted'
      : 'text-app-text';

  return (
    <div
      className={`relative flex w-full flex-col px-3 ${containerState} ${className}`}
      tabIndex={isEditing || isDisabled ? -1 : (tabIndex ?? 0)}
      {...props}
    >
      <div
        className={`relative flex min-h-12 w-full shrink-0 items-start gap-3 py-3 ${
          isEditing || isForcedHover
            ? ''
            : 'border-b border-app-border group-hover/task:border-transparent'
        }`}
      >
        <span className="flex shrink-0 items-center py-0.5">
          <DelayedTooltip
            disabled={isDisabled || isEditing}
            label={checked ? 'Mark incomplete' : 'Mark complete'}
            shortcut={[{ type: 'random', label: 'space' }]}
          >
            <Checkbox
              checked={checked}
              disabled={isDisabled || isEditing}
              tabIndex={-1}
              onChange={(event) =>
                onCheckedChange?.(event.currentTarget.checked)
              }
            />
          </DelayedTooltip>
        </span>

        {isEditing ? (
            <textarea
              ref={editorRef}
              aria-label="Task description"
              autoFocus={autoFocus}
              value={editorValue}
              placeholder="Start writing your task dude..."
              onChange={(event) => onValueChange?.(event.currentTarget.value)}
              onBlur={handleEditorSave}
              onKeyDown={(event) => {
                event.stopPropagation();

                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  handleEditorSave();
                }

                if (event.key === 'Escape') {
                  event.preventDefault();
                  setManualEditorHeight(null);
                  onCancel?.();
                }
              }}
              className="content-normal py-0.5 min-w-0 flex-1 resize-none bg-transparent p-0 text-sm font-medium leading-5 tracking-7 text-app-text outline-none placeholder:text-app-placeholder"
            />
        ) : (
          <DelayedTooltip
            className="min-w-0 flex-1"
            disabled={isDisabled}
            label="Edit task"
            shortcut={[{ type: 'random', label: 'return' }]}
          >
            <button
              type="button"
              tabIndex={-1}
              disabled={isDisabled}
              onClick={onEdit}
              className={`flex min-h-6 w-full min-w-0 items-center text-left ${labelState}`}
            >
              <span
                className="
                  min-w-0
                  flex-1
                  whitespace-normal
                  wrap-anywhere
                  text-sm
                  font-medium
                  leading-5
                  tracking-[0.14px]
                "
              >
                {label}
              </span>
            </button>
          </DelayedTooltip>
        )}

        {!isEditing && (
          <span className="flex h-6 shrink-0 items-center gap-1">
            <DelayedTooltip
              disabled={isDisabled}
              label={isSubtask ? 'Convert to task' : 'Convert to subtask'}
              shortcut={[
                ...modifierShortcut,
                { type: 'random', label: isSubtask ? '←' : '→' },
              ]}
            >
              <IconButton
                aria-label={
                  isSubtask ? 'Convert to task' : 'Convert to subtask'
                }
                disabled={isDisabled}
                tabIndex={-1}
                variant="ghost"
                onClick={(event) => {
                  stopActionPropagation(event);
                  onToggleSubtask?.();
                }}
                icon={chevronRightIcon}
                iconClassName={`${isDisabled ? 'opacity-60' : ''} ${isSubtask ? 'scale-x-[-1]' : ''}`}
              />
            </DelayedTooltip>
            <DelayedTooltip
              disabled={isDisabled}
              label="Delete task"
              shortcut={[
                { type: 'random', label: 'delete' },
                { type: 'random', label: 'esc' },
              ]}
            >
              <IconButton
                aria-label="Delete task"
                disabled={isDisabled}
                tabIndex={-1}
                variant="ghost"
                onClick={(event) => {
                  stopActionPropagation(event);
                  onDelete?.();
                }}
                icon={minusIcon}
                iconClassName={isDisabled ? 'opacity-60' : ''}
              />
            </DelayedTooltip>
          </span>
        )}
      </div>

      <AnimatePresence initial={false}>
        {isEditing && editorCanResize ? (
          <motion.span
            key="editor-expander"
            role="separator"
            aria-label="Resize editor"
            aria-orientation="horizontal"
            aria-valuemin={RESIZABLE_EDITOR_HEIGHT}
            aria-valuemax={MAX_EDITOR_HEIGHT}
            aria-valuenow={manualEditorHeight ?? RESIZABLE_EDITOR_HEIGHT}
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;

              event.preventDefault();
              event.stopPropagation();
              const currentHeight =
                manualEditorHeight ?? editorRef.current?.offsetHeight ?? 80;
              const change = event.key === 'ArrowDown' ? 24 : -24;
              setManualEditorHeight(
                Math.min(
                  MAX_EDITOR_HEIGHT,
                  Math.max(
                    RESIZABLE_EDITOR_HEIGHT,
                    currentHeight + change,
                  ),
                ),
              );
            }}
            onPointerDown={(event) => {
              event.preventDefault();
              resizeStartRef.current = {
                height: editorRef.current?.offsetHeight ?? 80,
                pointerId: event.pointerId,
                y: event.clientY,
              };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              const resizeStart = resizeStartRef.current;

              if (!resizeStart || resizeStart.pointerId !== event.pointerId) {
                return;
              }

              setManualEditorHeight(
                Math.max(
                  120,
                  resizeStart.height + event.clientY - resizeStart.y,
                ),
              );
            }}
            onPointerUp={(event) => {
              if (resizeStartRef.current?.pointerId !== event.pointerId) return;
              resizeStartRef.current = null;
              event.currentTarget.releasePointerCapture(event.pointerId);
            }}
            onLostPointerCapture={() => {
              resizeStartRef.current = null;
            }}
            className="flex size-6 touch-none cursor-ns-resize items-center justify-center rounded-md absolute z-index-2 bottom-1 right-1 focus-visible:outline-2 focus-visible:outline-(--color-primary-tone-100) focus-visible:outline-offset-2 focus-visible:shadow-app-focus "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Icon src={inputExpanderIcon} className="size-3.5 text-app-disabled" />
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default TaskItem;
