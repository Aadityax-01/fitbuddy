const VARIANT_MAP = {
  success: {
    bg: 'rgba(57,255,20,0.12)',
    border: 'rgba(57,255,20,0.25)',
    color: '#39ff14',
    dot: '#39ff14',
  },
  warning: {
    bg: 'rgba(234,179,8,0.12)',
    border: 'rgba(234,179,8,0.25)',
    color: '#eab308',
    dot: '#eab308',
  },
  danger: {
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.25)',
    color: '#ef4444',
    dot: '#ef4444',
  },
  info: {
    bg: 'rgba(59,130,246,0.12)',
    border: 'rgba(59,130,246,0.25)',
    color: '#3b82f6',
    dot: '#3b82f6',
  },
  default: {
    bg: 'rgba(156,163,175,0.1)',
    border: 'rgba(156,163,175,0.2)',
    color: '#9ca3af',
    dot: '#9ca3af',
  },
};

const SIZE_MAP = {
  sm: 'text-[10px] px-2 py-0.5 gap-1',
  md: 'text-xs px-2.5 py-1 gap-1.5',
  lg: 'text-sm px-3 py-1.5 gap-2',
};

/**
 * Small status badge component.
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
            boxShadow: `0 0 6px ${v.dot}88`,
          }}
        />
      )}
      {children}
    </span>
  );
}
