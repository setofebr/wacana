import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import Tooltip, { type TooltipShortcutKey } from './Tooltip';

type TooltipPlacement = 'bottom' | 'top';

type DelayedTooltipProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  label: ReactNode;
  placement?: TooltipPlacement;
  shortcut?: TooltipShortcutKey[];
};

type TooltipPosition = {
  left: number;
  placement: TooltipPlacement;
  top: number;
};

const tooltipDelay = 2000;
const tooltipGap = 8;
const viewportPadding = 8;

function DelayedTooltip({
  children,
  className = '',
  disabled = false,
  label,
  placement = 'top',
  shortcut = [],
}: DelayedTooltipProps) {
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<TooltipPosition>({
    left: 0,
    placement,
    top: 0,
  });

  const clearShowTimeout = () => {
    if (timeoutRef.current === null) return;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  const hideTooltip = () => {
    clearShowTimeout();
    setOpen(false);
  };

  const scheduleTooltip = () => {
    if (disabled) return;
    clearShowTimeout();
    timeoutRef.current = setTimeout(() => setOpen(true), tooltipDelay);
  };

  useLayoutEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const trigger = triggerRef.current;
      const tooltip = tooltipRef.current;

      if (!trigger || !tooltip) return;

      const triggerBounds = trigger.getBoundingClientRect();
      const tooltipBounds = tooltip.getBoundingClientRect();
      let actualPlacement = placement;
      let top =
        placement === 'top'
          ? triggerBounds.top - tooltipBounds.height - tooltipGap
          : triggerBounds.bottom + tooltipGap;

      if (placement === 'top' && top < viewportPadding) {
        actualPlacement = 'bottom';
        top = triggerBounds.bottom + tooltipGap;
      } else if (
        placement === 'bottom' &&
        top + tooltipBounds.height > window.innerHeight - viewportPadding
      ) {
        actualPlacement = 'top';
        top = triggerBounds.top - tooltipBounds.height - tooltipGap;
      }

      const centeredLeft =
        triggerBounds.left + triggerBounds.width / 2 - tooltipBounds.width / 2;
      const left = Math.min(
        Math.max(centeredLeft, viewportPadding),
        window.innerWidth - tooltipBounds.width - viewportPadding,
      );

      setPosition({ left, placement: actualPlacement, top });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [open, placement]);

  useLayoutEffect(() => () => clearShowTimeout(), []);

  const tooltipStyle: CSSProperties = {
    left: position.left,
    top: position.top,
  };

  return (
    <span
      ref={triggerRef}
      className={`relative inline-flex ${className}`}
      onMouseEnter={scheduleTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {createPortal(
        <AnimatePresence initial={false}>
          {open ? (
            <motion.div
              key="tooltip"
              aria-hidden="true"
              className="pointer-events-none fixed z-50"
              style={tooltipStyle}
              initial={{
                opacity: 0,
                y: position.placement === 'top' ? 2 : -2,
              }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
            >
              <Tooltip
                ref={tooltipRef}
                label={label}
                placement={position.placement}
                shortcut={shortcut}
              />
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.body,
      )}
    </span>
  );
}

export default DelayedTooltip;
