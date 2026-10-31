const VARIANT_MAP = {
  success: {
    bg: '#262626',
    border: '#404040',
    color: '#FFFFFF',
    dot: '#FFFFFF',
  },
  warning: {
    bg: '#262626',
    border: '#404040',
    color: '#D4D4D4',
    dot: '#D4D4D4',
  },
  danger: {
    bg: '#262626',
    border: '#404040',
    color: '#A3A3A3',
    dot: '#A3A3A3',
  },
  info: {
    bg: '#262626',
    border: '#404040',
    color: '#E5E5E5',
    dot: '#E5E5E5',
  },
  default: {
    bg: '#171717',
    border: '#404040',
    color: '#A3A3A3',
    dot: '#A3A3A3',
  },
};

const SIZE_MAP = {
  sm: 'text-[10px] px-2 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-1 gap-1.5',
  lg: 'text-sm px-3 py-1.5 gap-2',
};

/**
 * Small status badge component in strict monochrome styling.
 *
 * @param {{
 *   children: React.ReactNode,
 *   variant?: 'success' | 'warning' | 'danger' | 'info' | 'default',
 *   size?: 'sm' | 'md' | 'lg',
 *   dot?: boolean,
 *   className?: string,
 * }} props
 */
export default function Badge({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) {
  const v = VARIANT_MAP[variant] || VARIANT_MAP.default;
  const s = SIZE_MAP[size] || SIZE_MAP.md;

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full leading-none whitespace-nowrap ${s} ${className}`}
      style={{
        backgroundColor: v.bg,
        border: `1px solid ${v.border}`,
        color: v.color,
      }}
    >
      {dot && (
        <span
          className="flex-shrink-0 rounded-full"
          style={{
            width: size === 'sm' ? 5 : size === 'lg' ? 8 : 6,
            height: size === 'sm' ? 5 : size === 'lg' ? 8 : 6,
            backgroundColor: v.dot,
          }}
        />
      )}
      {children}
    </span>
  );
}
