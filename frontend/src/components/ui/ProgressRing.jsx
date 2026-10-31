import { useEffect, useRef, useState } from 'react';

/**
 * Strict monochrome circular progress ring.
 */
export default function ProgressRing({
  percentage = 0,
  size = 120,
  strokeWidth = 10,
  color = '#FFFFFF',
  trackColor = '#262626',
  label = '',
  value,
  className = '',
}) {
  const [animatedPct, setAnimatedPct] = useState(0);
  const rafRef = useRef(null);

  const clampedPct = Math.min(Math.max(percentage, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  useEffect(() => {
    const start = performance.now();
    const duration = 1000;
    const from = 0;
    const to = clampedPct;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedPct(from + (to - from) * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [clampedPct]);

  const offset = circumference - (animatedPct / 100) * circumference;

  return (
    <div className={`relative inline-flex flex-col items-center gap-2 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-label={`${label || 'Progress'}: ${Math.round(animatedPct)}%`}
          role="img"
        >
          {/* Track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />

          {/* Progress arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${center} ${center})`}
            style={{
              transition: 'stroke-dashoffset 0.05s linear',
            }}
          />
        </svg>

        {/* Center text */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center select-none"
        >
          <span className="text-white font-black leading-none" style={{ fontSize: size * 0.18 }}>
            {value !== undefined ? value : `${Math.round(animatedPct)}%`}
          </span>
          {value !== undefined && (
            <span
              className="font-medium leading-tight text-[#A3A3A3]"
              style={{ fontSize: size * 0.11 }}
            >
              {Math.round(animatedPct)}%
            </span>
          )}
        </div>
      </div>

      {label && (
        <p className="text-sm font-medium text-center text-[#A3A3A3]">
          {label}
        </p>
      )}
    </div>
  );
}
