import { Loader2 } from 'lucide-react';

const VARIANT_STYLES = {
  primary: {
    base: 'text-black font-semibold',
    bg: '#39ff14',
    hoverBg: '#2de010',
    shadow: '0 0 16px rgba(57,255,20,0.35)',
    disabledBg: 'rgba(57,255,20,0.3)',
    disabledText: 'rgba(0,0,0,0.5)',
  },
  secondary: {
    base: 'text-white font-medium',
    bg: '#1a1a1a',
    hoverBg: '#222222',
    shadow: 'none',
    disabledBg: '#111111',
    disabledText: '#4b5563',
  },
  outline: {
    base: 'font-medium',
    border: '1.5px solid #39ff14',
    color: '#39ff14',
    hoverBg: 'rgba(57,255,20,0.08)',
    shadow: 'none',
    disabledBorder: '1.5px solid #1a1a1a',
    disabledText: '#4b5563',
  },
  ghost: {
    base: 'font-medium',
    color: '#9ca3af',
    hoverBg: 'rgba(255,255,255,0.05)',
    hoverColor: '#ffffff',
    shadow: 'none',
    disabledText: '#4b5563',
  },
  danger: {
    base: 'text-white font-semibold',
    bg: '#ef4444',
    hoverBg: '#dc2626',
    shadow: '0 0 16px rgba(239,68,68,0.3)',
    disabledBg: 'rgba(239,68,68,0.3)',
    disabledText: 'rgba(255,255,255,0.4)',
  },
};

const SIZE_CLASSES = {
  sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
  md: 'h-10 px-4 text-sm rounded-xl gap-2',
  lg: 'h-12 px-6 text-base rounded-xl gap-2.5',
};

const ICON_SIZE = { sm: 13, md: 15, lg: 17 };

/**
 * Versatile button component for FitBuddy AI.
 *
 * @param {{
 *   children: React.ReactNode,
 *   variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger',
 *   size?: 'sm' | 'md' | 'lg',
 *   loading?: boolean,
 *   disabled?: boolean,
 *   leftIcon?: React.ElementType,
 *   rightIcon?: React.ElementType,
 *   fullWidth?: boolean,
 *   onClick?: () => void,
 *   type?: 'button' | 'submit' | 'reset',
 *   className?: string,
 * }} props
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...rest
}) {
  const v = VARIANT_STYLES[variant] || VARIANT_STYLES.primary;
  const isDisabled = disabled || loading;

  // Build inline style object per variant
  function getStyle() {
    const base = {
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      transition: 'all 0.15s ease',
      outline: 'none',
    };

    if (variant === 'primary') {
      return {
        ...base,
        backgroundColor: isDisabled ? v.disabledBg : v.bg,
        color: isDisabled ? v.disabledText : 'black',
        boxShadow: isDisabled ? 'none' : v.shadow,
      };
    }
    if (variant === 'secondary') {
      return {
        ...base,
        backgroundColor: isDisabled ? v.disabledBg : v.bg,
        color: isDisabled ? v.disabledText : 'white',
        border: '1px solid #1a1a1a',
      };
    }
    if (variant === 'outline') {
      return {
        ...base,
        backgroundColor: 'transparent',
        border: isDisabled ? v.disabledBorder : v.border,
        color: isDisabled ? v.disabledText : v.color,
      };
    }
    if (variant === 'ghost') {
      return {
        ...base,
        backgroundColor: 'transparent',
        color: isDisabled ? v.disabledText : v.color,
      };
    }
    if (variant === 'danger') {
      return {
        ...base,
        backgroundColor: isDisabled ? v.disabledBg : v.bg,
        color: isDisabled ? v.disabledText : 'white',
        boxShadow: isDisabled ? 'none' : v.shadow,
      };
    }
    return base;
  }

  const iconSz = ICON_SIZE[size] || 15;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      style={getStyle()}
      className={[
        'inline-flex items-center justify-center select-none',
        'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500',
        SIZE_CLASSES[size] || SIZE_CLASSES.md,
        v.base || '',
        fullWidth ? 'w-full' : '',
        isDisabled ? 'opacity-60' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {loading ? (
        <Loader2 size={iconSz} className="animate-spin flex-shrink-0" />
      ) : (
        LeftIcon && <LeftIcon size={iconSz} className="flex-shrink-0" />
      )}
      {children && <span>{children}</span>}
      {!loading && RightIcon && <RightIcon size={iconSz} className="flex-shrink-0" />}
    </button>
  );
}
