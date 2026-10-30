import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * Animates a number from 0 to `target` over `duration` ms.
 * @param {number} target
 * @param {number} duration
 * @returns {number}
 */
function useAnimatedNumber(target, duration = 900) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const from = 0;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (target - from) * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return display;
}

/**
 * @param {{
 *   icon: React.ElementType,
 *   title: string,
 *   value: number | string,
 *   unit?: string,
 *   change?: number,
 *   changeLabel?: string,
 *   progress?: number,
 *   accentLeft?: boolean,
 *   iconColor?: string,
 *   className?: string,
 * }} props
 */
export default function StatCard({
  icon: Icon,
  title,
  value,
  unit = '',
  change,
  changeLabel = 'vs last week',
  progress,
  accentLeft = false,
  iconColor = '#39ff14',
  className = '',
}) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  const animated = useAnimatedNumber(numericValue);

  const displayValue =
    typeof value === 'number'
      ? Number.isInteger(value)
        ? Math.round(animated).toLocaleString()
        : animated.toFixed(1)
      : value; // string passthrough (e.g. "—")

  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isFlat = change !== undefined && change === 0;

  return (
    <div
      className={`relative rounded-xl p-5 flex flex-col gap-3 overflow-hidden transition-transform duration-200 hover:scale-[1.02] ${className}`}
      style={{
        backgroundColor: '#111111',
        border: '1px solid #1a1a1a',
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
      }}
    >
      {/* Left accent bar */}
      {accentLeft && (
        <div
          className="absolute left-0 top-4 bottom-4 w-1 rounded-full"
          style={{ backgroundColor: '#39ff14' }}
        />
      )}

      {/* Top row: icon + change badge */}
      <div className="flex items-start justify-between">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${iconColor}18` }}
        >
          {Icon && <Icon size={22} style={{ color: iconColor }} />}
        </div>

        {change !== undefined && (
          <div
            className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: isPositive
                ? 'rgba(57,255,20,0.12)'
                : isNegative
                ? 'rgba(239,68,68,0.12)'
                : 'rgba(156,163,175,0.12)',
              color: isPositive ? '#39ff14' : isNegative ? '#ef4444' : '#9ca3af',
            }}
          >
            {isPositive && <TrendingUp size={12} />}
            {isNegative && <TrendingDown size={12} />}
            {isFlat && <Minus size={12} />}
            {isPositive ? '+' : ''}{change}%
          </div>
        )}
      </div>

      {/* Value + unit */}
      <div>
        <div className="flex items-end gap-1.5">
          <span className="text-3xl font-bold text-white leading-none tabular-nums">
            {displayValue}
          </span>
          {unit && (
            <span className="text-sm font-medium mb-0.5" style={{ color: '#9ca3af' }}>
              {unit}
            </span>
          )}
        </div>
        <p className="text-sm mt-1.5 font-medium" style={{ color: '#9ca3af' }}>
          {title}
        </p>
        {change !== undefined && (
          <p className="text-xs mt-0.5 text-gray-600">{changeLabel}</p>
        )}
      </div>

      {/* Progress bar */}
      {progress !== undefined && (
        <div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: '#1a1a1a' }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min(Math.max(progress, 0), 100)}%`,
                backgroundColor: '#39ff14',
                boxShadow: '0 0 8px rgba(57,255,20,0.6)',
              }}
            />
          </div>
          <p className="text-xs mt-1 text-gray-600">{progress}% of goal</p>
        </div>
      )}
    </div>
  );
}
