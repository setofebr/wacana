import type { HTMLAttributes, ReactNode } from 'react';

type KeySize = 'small' | 'medium';
type KeyType = 'command' | 'option' | 'random';

type KeyProps = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
  size?: KeySize;
  type?: KeyType;
};

const keyLabels: Record<KeyType, string> = {
  command: '⌘',
  option: '⌥',
  random: 'return',
};

function Key({
  children,
  className = '',
  size = 'small',
  type = 'command',
  ...props
}: KeyProps) {
  const isSmall = size === 'small';
  const horizontalPadding = isSmall && type !== 'random' ? 'px-0.75' : 'px-1';
  const sizeClasses = isSmall
    ? 'h-4 text-[9px] text-app-surface'
    : 'h-5 text-xs text-app-muted';

  return (
    <kbd
      className={`inline-flex items-center justify-center rounded border border-app-key-border font-app-mono font-semibold leading-4 whitespace-nowrap opacity-80 ${horizontalPadding} ${sizeClasses} ${className}`}
      {...props}
    >
      {children ?? keyLabels[type]}
    </kbd>
  );
}

export default Key;
