import { useRef, useState, type ReactNode } from 'react';
import { AnimatePresence } from 'motion/react';
import backwardIcon from '../../assets/icon/backward.svg';
import enterIcon from '../../assets/icon/enter.svg';
import forwardIcon from '../../assets/icon/forward.svg';
import logo from '../../assets/logo.svg';
import profileImage from '../../assets/profile-seto.png';
import ButtonAdd from '../ui/ButtonAdd';
import DelayedTooltip from '../ui/DelayedTooltip';
import IconButton from '../ui/IconButton';
import KeyboardShortcutsModal from './KeyboardShortcutsModal';

type WacanaShellProps = {
  canRedo?: boolean;
  canUndo?: boolean;
  children: ReactNode;
  onCreateTask: () => void;
  onRedo: () => void;
  onUndo: () => void;
};

function WacanaShell({
  canRedo = false,
  canUndo = false,
  children,
  onCreateTask,
  onRedo,
  onUndo,
}: WacanaShellProps) {
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const shortcutsButtonRef = useRef<HTMLButtonElement>(null);
  const usesCommandKey = /Mac|iPhone|iPad|iPod/i.test(navigator.platform);
  const modifierShortcut = usesCommandKey
    ? [{ type: 'command' as const }]
    : [{ type: 'random' as const, label: 'Ctrl' }];

  const closeShortcuts = () => {
    setShortcutsOpen(false);
    requestAnimationFrame(() => shortcutsButtonRef.current?.focus());
  };

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-app-canvas px-3 py-8 text-app-text">
      <section
        inert={shortcutsOpen}
        className="relative z-10 flex w-full max-w-90 flex-col gap-5 md:-translate-y-7"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-[-50vh] bottom-[-50vh] left-5 -z-10 border-l border-app-border"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-[-50vh] right-5 bottom-[-50vh] -z-10 border-r border-app-border"
        />

        <header className="relative flex h-6 items-center justify-between px-5">
          <div className="flex h-6 w-40 items-center gap-1">
            <img src={logo} alt="" className="size-6 shrink-0" />
            <span className="font-app-brand text-2xl leading-6 tracking-[0.48px]">
              wacana
            </span>
          </div>

          <DelayedTooltip
            label="Add task"
            placement="bottom"
            shortcut={[{ type: 'random', label: 'return' }]}
          >
            <ButtonAdd onClick={onCreateTask} />
          </DelayedTooltip>
        </header>

        {children}

        <footer className="relative flex h-6 items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <span className="relative size-6 shrink-0">
              <img
                src={profileImage}
                alt="Seto Febriant"
                className="absolute -top-px -left-1 h-11 w-8 max-w-none"
              />
            </span>
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium leading-5 tracking-[0.12px] text-app-muted">
                by
              </span>
              <span className="text-xs font-semibold leading-5 tracking-[0.12px] text-app-muted">
                <a
                  href="https://setofebriant.com"
                  className="hover:underline hover:text-app-accent"
                >
                Seto Febriant
                </a>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DelayedTooltip label="Keyboard shortcuts">
              <IconButton
                ref={shortcutsButtonRef}
                aria-label="Keyboard shortcuts"
                aria-expanded={shortcutsOpen}
                variant="ghost"
                onClick={() => setShortcutsOpen(true)}
                className={shortcutsOpen ? 'bg-app-hover' : ''}
                icon={enterIcon}
              />
            </DelayedTooltip>

            <span aria-hidden="true" className="h-4 w-px bg-app-divider" />

            <DelayedTooltip
              label="Undo"
              shortcut={[...modifierShortcut, { type: 'random', label: 'Z' }]}
            >
              <IconButton
                aria-label="Undo"
                aria-disabled={!canUndo}
                onClick={canUndo ? onUndo : undefined}
                icon={backwardIcon}
                iconClassName="opacity-60"
              />
            </DelayedTooltip>

            <DelayedTooltip
              label="Redo"
              shortcut={[...modifierShortcut, { type: 'random', label: '⇧Z' }]}
            >
              <IconButton
                aria-label="Redo"
                aria-disabled={!canRedo}
                onClick={canRedo ? onRedo : undefined}
                icon={forwardIcon}
                iconClassName="opacity-60"
              />
            </DelayedTooltip>
          </div>
        </footer>
      </section>

      <AnimatePresence initial={false}>
        {shortcutsOpen ? (
          <KeyboardShortcutsModal
            key="keyboard-shortcuts"
            modifierLabel={usesCommandKey ? undefined : 'Ctrl'}
            modifierType={usesCommandKey ? 'command' : 'random'}
            onClose={closeShortcuts}
          />
        ) : null}
      </AnimatePresence>
    </main>
  );
}

export default WacanaShell;
