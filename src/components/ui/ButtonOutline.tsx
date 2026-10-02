import type { ButtonHTMLAttributes } from 'react';
import plusOutlineIcon from '../../assets/icon/plus.svg';
import Icon from './Icon';

type ButtonOutlineProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  leftIcon?: string;
  leftIconClassName?: string;
  rightIcon?: string;
  rightIconClassName?: string;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
};

function ButtonOutline({
  children = 'button',
  className = '',
  disabled = false,
  leftIcon,
  leftIconClassName = '',
  rightIcon,
  rightIconClassName = '',
  showLeftIcon = true,
  showRightIcon = true,
  type = 'button',
  ...props
}: ButtonOutlineProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`group inline-flex h-6 shrink-0 items-center overflow-hidden rounded-lg bg-app-surface px-2 text-xs font-medium leading-5 tracking-[0.12px] text-app-muted shadow-app-xs transition-colors hover:bg-app-control-hover focus-visible:outline-2 focus-visible:outline-(--color-primary-tone-100) focus-visible:outline-offset-2 focus-visible:shadow-app-focus disabled:cursor-not-allowed disabled:bg-app-disabled disabled:shadow-app-xs ${className}`}
      {...props}
    >
      <span className="inline-flex items-center transition-opacity group-disabled:opacity-60">
        {showLeftIcon && (
          <span
            aria-hidden="true"
            className="flex text-app-muted size-3.5 shrink-0 items-center justify-center"
          >
            <Icon
              src={leftIcon ?? plusOutlineIcon}
              className={`${leftIcon ? 'size-full' : 'size-3'} ${leftIconClassName}`}
            />
          </span>
        )}

        <span className="px-1">{children}</span>

        {showRightIcon && (
          <span
            aria-hidden="true"
            className="flex text-app-muted size-3.5 shrink-0 items-center justify-center"
          >
            <Icon
              src={rightIcon ?? plusOutlineIcon}
              className={`${rightIcon ? 'size-full' : 'size-3'} ${rightIconClassName}`}
            />
          </span>
        )}
      </span>
    </button>
  );
}

export default ButtonOutline;
