import type { HTMLAttributes } from 'react';

type IconProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  src: string;
};

function Icon({ src, className = '', style, ...props }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        WebkitMaskImage: `url("${src}")`,
        WebkitMaskPosition: 'center',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskSize: 'contain',
        maskImage: `url("${src}")`,
        maskPosition: 'center',
        maskRepeat: 'no-repeat',
        maskSize: 'contain',
        ...style,
      }}
      {...props}
    />
  );
}

export default Icon;
