/**
 * Strict monochrome loading spinner component.
 */
export default function LoadingSpinner({
  fullPage = false,
  size = 40,
  color = '#FFFFFF',
  label = 'Loading…',
  className = '',
}) {
  const spinner = (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
      role="status"
      aria-label={label}
    >
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
            stroke="#404040"
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
          />
        </svg>
      </div>

      {fullPage && (
        <p className="text-sm font-medium animate-pulse text-[#A3A3A3]">
          {label}
        </p>
      )}

      <span className="sr-only">{label}</span>
    </div>
  );

  if (fullPage) {
    return (
      <div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000000]"
      >
        <div className="mb-6 relative z-10">
          <svg width="48" height="48" viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect width="32" height="32" rx="8" fill="#262626" stroke="#404040" />
            <path
              d="M18.5 4L10 18h7.5L13.5 28 22 14h-7L18.5 4Z"
              fill="#FFFFFF"
              stroke="#FFFFFF"
              strokeWidth="0.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="relative z-10">{spinner}</div>
      </div>
    );
  }

  return spinner;
}

export function SpinnerInline({ size = 16, color = '#FFFFFF', className = '' }) {
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
        stroke="#404040"
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
