import { useEffect, useRef, useState } from 'react';

/**
 * SVG circular progress ring with animated stroke-dashoffset on mount.
 *
 * @param {{
 *   percentage: number,
 *   size?: number,
 *   strokeWidth?: number,
 *   color?: string,
 *   trackColor?: string,
 *   label?: string,
 *   value?: string | number,
 *   className?: string,
 * }} props
 */
export default function ProgressRing({
  percentage = 0,
  size = 120,
  strokeWidth = 10,
  color = '#39ff14',
  trackColor = '#1a1a1a',
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
      // Ease out cubic
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
          {/* Glow filter */}
          <defs>
            <filter id={`glow-${color.replace('#', '')}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

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
              filter: `drop-shadow(0 0 6px ${color}99)`,
              transition: 'stroke-dashoffset 0.05s linear',
            }}
          />
        </svg>

        {/* Center text */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center select-none"
        >
          <span className="text-white font-bold leading-none" style={{ fontSize: size * 0.18 }}>
            {value !== undefined ? value : `${Math.round(animatedPct)}%`}
          </span>
          {value !== undefined && (
            <span
              className="font-medium leading-tight"
              style={{ fontSize: size * 0.11, color: '#9ca3af' }}
            >
              {Math.round(animatedPct)}%
            </span>
          )}
        </div>
      </div>

      {label && (
        <p className="text-sm font-medium text-center" style={{ color: '#9ca3af' }}>
          {label}
        </p>
      )}
    </div>
  );
}
