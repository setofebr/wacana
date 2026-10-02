import type { HTMLAttributes, ReactNode, Ref } from 'react';
import Key from './Key';

export type TooltipShortcutKey = {
  label?: ReactNode;
  type?: 'command' | 'option' | 'random';
};

type TooltipProps = HTMLAttributes<HTMLDivElement> & {
  label?: ReactNode;
  placement?: 'bottom' | 'top';
  ref?: Ref<HTMLDivElement>;
  shortcut?: TooltipShortcutKey[];
};

const defaultShortcut: TooltipShortcutKey[] = [
  { type: 'command' },
  { type: 'option' },
  { type: 'random' },
  { type: 'random' },
];

function Tooltip({
  className = '',
  label = 'Label',
  placement = 'top',
  ref,
  shortcut = defaultShortcut,
  ...props
}: TooltipProps) {
  return (
    <div
      ref={ref}
      role="tooltip"
      className={`inline-flex w-max flex-col items-center shadow-app-lg ${className}`}
      {...props}
    >
      {placement === 'bottom' ? (
        <span
          aria-hidden="true"
          className="h-1.5 w-3 rotate-180 bg-app-text [clip-path:polygon(0_0,100%_0,50%_100%)]"
        />
      ) : null}

      <div className="flex h-6 w-full items-center justify-center gap-1 rounded-md bg-app-text px-2 text-app-surface shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
        <span className="text-xs font-medium leading-4 whitespace-nowrap">
          {label}
        </span>

        {shortcut.map((key, index) => (
          <Key
            key={`${key.type ?? 'command'}-${index}`}
            type={key.type}
            className="text-app-surface"
          >
            {key.label}
          </Key>
        ))}
      </div>

      {placement === 'top' ? (
        <span
          aria-hidden="true"
          className="h-1.5 w-3 bg-app-text [clip-path:polygon(0_0,100%_0,50%_100%)]"
        />
      ) : null}
    </div>
  );
}

export default Tooltip;
