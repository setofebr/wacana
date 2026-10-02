import type { InputHTMLAttributes } from 'react';
import { motion } from 'motion/react';
import checkIcon from '../../assets/icon/check-small.svg';
import Icon from './Icon';

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

function Checkbox({
  'aria-label': ariaLabel = 'Toggle selection',
  checked,
  className = '',
  disabled = false,
  ...props
}: CheckboxProps) {
  return (
    <span className={`relative inline-flex size-5 shrink-0 ${className}`}>
      <input
        type="checkbox"
        aria-label={ariaLabel}
        checked={checked}
        disabled={disabled}
        className="peer absolute inset-0 z-10 m-0 size-full cursor-pointer appearance-none opacity-0 disabled:cursor-not-allowed"
        {...props}
      />

      <span className="pointer-events-none inline-flex size-5 items-center justify-center overflow-hidden rounded-md bg-app-surface text-white shadow-app-xs transition-colors *:data-check-icon:opacity-0 peer-hover:bg-app-control-hover peer-focus-visible:shadow-app-focus peer-focus-visible:outline-2 peer-focus-visible:outline-(--color-primary-tone-100) peer-focus-visible:outline-offset-2 peer-checked:bg-app-accent peer-checked:shadow-app-primary-xs peer-checked:*:data-check-icon:opacity-100 peer-checked:peer-hover:bg-app-accent-hover peer-checked:peer-hover:*:data-check-icon:opacity-80 peer-disabled:bg-app-disabled-control peer-disabled:shadow-app-xs peer-checked:peer-disabled:bg-app-disabled peer-checked:peer-disabled:*:data-check-icon:opacity-60">
        <motion.span
          data-check-icon
          aria-hidden="true"
          initial={false}
          animate={{ scale: checked ? 1 : 0.75 }}
          className="inline-flex size-4.5 transition-opacity"
        >
          <Icon src={checkIcon} className="size-full" />
        </motion.span>
      </span>
    </span>
  );
}

export default Checkbox;
