import type { ButtonHTMLAttributes } from 'react';
import plusIcon from '../../assets/icon/plus.svg';
import Icon from './Icon';

type ButtonAddProps = ButtonHTMLAttributes<HTMLButtonElement>;

function ButtonAdd({
  'aria-label': ariaLabel = 'Add task',
  className = '',
  type = 'button',
  ...props
}: ButtonAddProps) {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      className={`group inline-flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-app-accent text-white shadow-app-primary transition-colors hover:bg-app-accent-hover focus-visible:outline-2 focus-visible:outline-(--color-primary-tone-100) focus-visible:outline-offset-2 focus-visible:shadow-app-focus disabled:cursor-not-allowed disabled:bg-app-disabled disabled:opacity-80 disabled:shadow-app ${className}`}
      {...props}
    >
      <Icon
        src={plusIcon}
        className="size-5 transition-opacity group-hover:opacity-80 group-disabled:opacity-60"
      />
    </button>
  );
}

export default ButtonAdd;
