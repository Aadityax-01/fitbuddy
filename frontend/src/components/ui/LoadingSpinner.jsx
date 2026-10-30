/**
 * Loading spinner component.
 * Renders either a full-page overlay or an inline spinner based on `fullPage` prop.
 *
 * @param {{
 *   fullPage?: boolean,
 *   size?: number,
 *   color?: string,
 *   label?: string,
 *   className?: string,
 * }} props
 */
export default function LoadingSpinner({
  fullPage = false,
  size = 40,
  color = '#39ff14',
  label = 'Loading…',
  className = '',
}) {
  const spinner = (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
      role="status"
      aria-label={label}
    >
      {/* Outer glow ring */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="animate-spin"
          style={{ animationDuration: '0.9s' }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 4}
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="4"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={size / 2 - 4}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={`${(size / 2 - 4) * 2 * Math.PI * 0.7} ${(size / 2 - 4) * 2 * Math.PI * 0.3}`}
            style={{ filter: `drop-shadow(0 0 6px ${color}bb)` }}
          />
        </svg>
      </div>

      {fullPage && (
        <p className="text-sm font-medium animate-pulse" style={{ color: '#9ca3af' }}>
          {label}
        </p>
      )}

      {/* Screen reader text */}
      <span className="sr-only">{label}</span>
    </div>
  );

  if (fullPage) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center"
        style={{ backgroundColor: '#0a0a0a' }}
      >
        {/* Animated background pulse */}
        <div
          className="absolute rounded-full opacity-10 animate-ping"
          style={{
            width: size * 2.5,
            height: size * 2.5,
            backgroundColor: color,
            animationDuration: '1.5s',
          }}
        />
        <div
          className="absolute rounded-full opacity-5"
          style={{
            width: size * 4,
            height: size * 4,
            backgroundColor: color,
          }}
        />

        {/* Logo mark */}
        <div className="mb-6 relative z-10">
          <svg width="48" height="48" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="#39ff14" fillOpacity="0.12" />
            <path
              d="M18.5 4L10 18h7.5L13.5 28 22 14h-7L18.5 4Z"
              fill="#39ff14"
              stroke="#39ff14"
              strokeWidth="0.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="relative z-10">{spinner}</div>
      </div>
    );
  }

  // Inline / small variant
  return spinner;
}

/**
 * Tiny inline spinner for use inside buttons or text.
 * @param {{ size?: number, color?: string, className?: string }} props
 */
export function SpinnerInline({ size = 16, color = '#39ff14', className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`animate-spin inline-block ${className}`}
      style={{ animationDuration: '0.75s' }}
      aria-hidden="true"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 2}
        fill="none"
        stroke="#1a1a1a"
        strokeWidth="2"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 2}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray={`${(size / 2 - 2) * 2 * Math.PI * 0.65} ${(size / 2 - 2) * 2 * Math.PI * 0.35}`}
      />
    </svg>
  );
}
