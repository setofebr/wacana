import type { ButtonHTMLAttributes, Ref } from 'react';
import chevronRightIcon from '../../assets/icon/chevron-right.svg';
import Icon from './Icon';

type IconButtonSize = 'small' | 'medium';
type IconButtonVariant = 'ghost' | 'outline';

type IconButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> & {
  icon?: string;
  iconClassName?: string;
  ref?: Ref<HTMLButtonElement>;
  size?: IconButtonSize;
  variant?: IconButtonVariant;
};

const buttonSizes: Record<IconButtonSize, string> = {
  small: 'size-6',
  medium: 'size-8',
};

const iconSizes: Record<IconButtonSize, string> = {
  small: 'size-3.5',
  medium: 'size-5',
};

function IconButton({
  'aria-label': ariaLabel = 'Next',
  className = '',
  disabled = false,
  icon,
  iconClassName = '',
  ref,
  size = 'small',
  type = 'button',
  variant = 'outline',
  ...props
}: IconButtonProps) {
  const variantClasses =
    variant === 'outline'
      ? 'bg-app-surface text-app-muted shadow-app-xs hover:bg-app-control-hover disabled:bg-app-disabled disabled:shadow-app-xs'
      : 'bg-transparent text-app-disabled shadow-none hover:bg-app-hover disabled:bg-transparent';

  return (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`group inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md transition-colors  focus-visible:shadow-app-focus focus-visible:outline-2 focus-visible:outline-(--color-primary-tone-100) focus-visible:outline-offset-2 disabled:cursor-not-allowed ${buttonSizes[size]} ${variantClasses} ${className}`}
      {...props}
    >
      <Icon
        src={icon ?? chevronRightIcon}
        className={`group-disabled:opacity-60 ${iconSizes[size]} ${iconClassName}`}
      />
    </button>
  );
}

export default IconButton;
