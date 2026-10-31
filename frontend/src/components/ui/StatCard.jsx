import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

function useAnimatedNumber(target, duration = 900) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const from = 0;

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
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
 * Strict monochrome StatCard component for FitBuddy AI.
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
  iconColor = '#FFFFFF',
  className = '',
}) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  const animated = useAnimatedNumber(numericValue);

  const displayValue =
    typeof value === 'number'
      ? Number.isInteger(value)
        ? Math.round(animated).toLocaleString()
        : animated.toFixed(1)
      : value;

  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isFlat = change !== undefined && change === 0;

  return (
    <div
      className={`relative rounded-xl p-5 flex flex-col gap-3 overflow-hidden transition-transform duration-200 hover:scale-[1.02] ${className}`}
      style={{
        backgroundColor: '#171717',
        border: '1px solid #404040',
        boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
      }}
    >
      {accentLeft && (
        <div
          className="absolute left-0 top-4 bottom-4 w-1 rounded-full bg-white"
        />
      )}

      {/* Top row: icon + change badge */}
      <div className="flex items-start justify-between">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#262626] border border-[#404040]"
        >
          {Icon && <Icon size={22} className="text-white" />}
        </div>

        {change !== undefined && (
          <div
            className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-[#262626] border border-[#404040] text-white"
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
          <span className="text-3xl font-black text-white leading-none tabular-nums">
            {displayValue}
          </span>
          {unit && (
            <span className="text-sm font-medium mb-0.5 text-[#A3A3A3]">
              {unit}
            </span>
          )}
        </div>
        <p className="text-sm mt-1.5 font-medium text-[#A3A3A3]">
          {title}
        </p>
        {change !== undefined && (
          <p className="text-xs mt-0.5 text-[#737373]">{changeLabel}</p>
        )}
      </div>

      {/* Progress bar */}
      {progress !== undefined && (
        <div>
          <div
            className="h-1.5 rounded-full overflow-hidden bg-[#262626]"
          >
            <div
              className="h-full rounded-full transition-all duration-1000 bg-white"
              style={{
                width: `${Math.min(Math.max(progress, 0), 100)}%`,
              }}
            />
          </div>
          <p className="text-xs mt-1 text-[#737373]">{progress}% of goal</p>
        </div>
      )}
    </div>
  );
}
