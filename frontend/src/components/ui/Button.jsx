import { Loader2 } from 'lucide-react';

const VARIANT_STYLES = {
  primary: {
    base: 'text-black font-bold',
    bg: '#FFFFFF',
    hoverBg: '#E5E5E5',
    shadow: 'none',
    disabledBg: '#737373',
    disabledText: '#171717',
  },
  secondary: {
    base: 'text-white font-medium',
    bg: '#262626',
    hoverBg: '#333333',
    shadow: 'none',
    disabledBg: '#171717',
    disabledText: '#737373',
  },
  outline: {
    base: 'font-semibold',
    border: '1.5px solid #FFFFFF',
    color: '#FFFFFF',
    hoverBg: '#262626',
    shadow: 'none',
    disabledBorder: '1.5px solid #404040',
    disabledText: '#737373',
  },
  ghost: {
    base: 'font-medium',
    color: '#A3A3A3',
    hoverBg: '#262626',
    hoverColor: '#FFFFFF',
    shadow: 'none',
    disabledText: '#737373',
  },
  danger: {
    base: 'text-white font-semibold',
    bg: '#262626',
    hoverBg: '#333333',
    border: '1px solid #404040',
    shadow: 'none',
    disabledBg: '#171717',
    disabledText: '#737373',
  },
};

const SIZE_CLASSES = {
  sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
  md: 'h-10 px-4 text-sm rounded-xl gap-2',
  lg: 'h-12 px-6 text-base rounded-xl gap-2.5',
};

const ICON_SIZE = { sm: 13, md: 15, lg: 17 };

/**
 * Strict monochrome Button component for FitBuddy AI.
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
        color: isDisabled ? v.disabledText : '#000000',
        border: '1px solid #FFFFFF',
      };
    }
    if (variant === 'secondary') {
      return {
        ...base,
        backgroundColor: isDisabled ? v.disabledBg : v.bg,
        color: isDisabled ? v.disabledText : '#FFFFFF',
        border: '1px solid #404040',
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
        color: isDisabled ? v.disabledText : '#FFFFFF',
        border: v.border,
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
        'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white',
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
