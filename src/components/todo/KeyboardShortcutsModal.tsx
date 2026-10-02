import { useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'motion/react';
import closeIcon from '../../assets/icon/close.svg';
import { subtlePresence } from '../../lib/motion';
import DelayedTooltip from '../ui/DelayedTooltip';
import IconButton from '../ui/IconButton';
import Key from '../ui/Key';

type KeyboardShortcutsModalProps = {
  modifierLabel?: string;
  modifierType: 'command' | 'random';
  onClose: () => void;
};

type ShortcutGroupProps = {
  children: ReactNode;
  title: string;
};

type ShortcutRowProps = {
  children: ReactNode;
  divider?: boolean;
  label: string;
};

function ShortcutGroup({ children, title }: ShortcutGroupProps) {
  return (
    <section
      aria-labelledby={`shortcut-${title.toLowerCase().replaceAll(' ', '-')}`}
    >
      <div className="mx-3 border-b border-app-divider py-1.5">
        <h3
          id={`shortcut-${title.toLowerCase().replaceAll(' ', '-')}`}
          className="flex min-h-6 items-center text-xs font-semibold leading-5 tracking-[0.12px] text-app-muted"
        >
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

function ShortcutRow({ children, divider = false, label }: ShortcutRowProps) {
  return (
    <div className="px-3">
      <div
        className={`flex min-h-12 items-center gap-1 py-4 ${divider ? 'border-b border-app-divider' : ''}`}
      >
        <span className="min-w-0 flex-1 text-sm font-medium leading-5 tracking-[0.14px]">
          {label}
        </span>
        <span className="flex shrink-0 items-center gap-1">{children}</span>
      </div>
    </div>
  );
}

function ShortcutSeparator() {
  return (
    <span className="font-app-mono text-xs font-semibold leading-4 text-app-placeholder opacity-80">
      /
    </span>
  );
}

function ShortcutKey({ children }: { children: ReactNode }) {
  return (
    <Key size="medium" type="random">
      {children}
    </Key>
  );
}

function KeyboardShortcutsModal({
  modifierLabel,
  modifierType,
  onClose,
}: KeyboardShortcutsModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
  }, []);

  return (
    <motion.aside
      role="dialog"
      aria-labelledby="keyboard-shortcuts-title"
      aria-modal="true"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          onClose();
        }

        if (event.key === 'Tab') {
          event.preventDefault();
          closeButtonRef.current?.focus();
        }
      }}
      className="task-scrollbar fixed top-8 right-3 left-3 z-30 max-h-[calc(100dvh-64px)] overflow-y-auto rounded-3xl bg-app-surface p-3 text-app-text shadow-app-xl sm:right-5 sm:left-auto sm:w-90"
      variants={subtlePresence}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <header className="flex min-h-12 items-center gap-1 px-3">
        <h2
          id="keyboard-shortcuts-title"
          className="min-w-0 flex-1 text-base font-medium leading-5 tracking-[0.16px]"
        >
          Keyboard Shortcut
        </h2>
        <DelayedTooltip
          label="Close"
          placement="bottom"
          shortcut={[{ type: 'random', label: 'esc' }]}
        >
          <IconButton
            ref={closeButtonRef}
            aria-label="Close keyboard shortcuts"
            size="medium"
            variant="ghost"
            onClick={onClose}
            icon={closeIcon}
          />
        </DelayedTooltip>
      </header>

      <ShortcutGroup title="No Task Selected">
        <ShortcutRow label="New Task">
          <ShortcutKey>enter</ShortcutKey>
          <ShortcutSeparator />
          <ShortcutKey>return</ShortcutKey>
          <ShortcutSeparator />
          <ShortcutKey>N</ShortcutKey>
        </ShortcutRow>
      </ShortcutGroup>

      <ShortcutGroup title="Task Selected">
        <ShortcutRow divider label="Edit Task">
          <ShortcutKey>enter</ShortcutKey>
          <ShortcutSeparator />
          <ShortcutKey>return</ShortcutKey>
        </ShortcutRow>
        <ShortcutRow divider label="Delete Task">
          <ShortcutKey>delete</ShortcutKey>
          <ShortcutSeparator />
          <ShortcutKey>esc</ShortcutKey>
        </ShortcutRow>
        <ShortcutRow divider label="Toggle Complete">
          <ShortcutKey>space</ShortcutKey>
        </ShortcutRow>
        <ShortcutRow divider label="Copy Task">
          <Key size="medium" type={modifierType}>
            {modifierLabel || undefined}
          </Key>
          <ShortcutKey>C</ShortcutKey>
        </ShortcutRow>
        <ShortcutRow divider label="Paste Task">
          <Key size="medium" type={modifierType}>
            {modifierLabel || undefined}
          </Key>
          <ShortcutKey>V</ShortcutKey>
        </ShortcutRow>
        <ShortcutRow divider label="Move selection">
          <ShortcutKey>↑</ShortcutKey>
          <ShortcutSeparator />
          <ShortcutKey>↓</ShortcutKey>
        </ShortcutRow>
        <ShortcutRow divider label="Task to Subtask">
          <Key size="medium" type={modifierType}>
            {modifierLabel || undefined}
          </Key>
          <ShortcutKey>→</ShortcutKey>
        </ShortcutRow>
        <ShortcutRow label="Subtask to Task">
          <Key size="medium" type={modifierType}>
            {modifierLabel || undefined}
          </Key>
          <ShortcutKey>←</ShortcutKey>
        </ShortcutRow>
      </ShortcutGroup>

      <ShortcutGroup title="Task on Edit">
        <ShortcutRow divider label="Save Task">
          <ShortcutKey>enter</ShortcutKey>
        </ShortcutRow>
        <ShortcutRow label="Cancel Edit Task">
          <ShortcutKey>esc</ShortcutKey>
        </ShortcutRow>
      </ShortcutGroup>

      <ShortcutGroup title="General">
        <ShortcutRow divider label="Undo">
          <Key size="medium" type={modifierType}>
            {modifierLabel || undefined}
          </Key>
          <ShortcutKey>Z</ShortcutKey>
        </ShortcutRow>
        <ShortcutRow label="Redo">
          <Key size="medium" type={modifierType}>
            {modifierLabel || undefined}
          </Key>
          <ShortcutKey>shift</ShortcutKey>
          <ShortcutKey>Z</ShortcutKey>
        </ShortcutRow>
      </ShortcutGroup>
    </motion.aside>
  );
}

export default KeyboardShortcutsModal;
