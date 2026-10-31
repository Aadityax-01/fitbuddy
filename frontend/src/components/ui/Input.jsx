import { forwardRef, useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

/**
 * Strict monochrome input field.
 */
const Input = forwardRef(function Input(
  {
    label,
    placeholder = '',
    error,
    hint,
    leftIcon: LeftIcon,
    rightElement,
    variant = 'default',
    type = 'text',
    id,
    disabled = false,
    required = false,
    className = '',
    wrapperClassName = '',
    ...rest
  },
  ref
) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  const borderColor = error ? '#FFFFFF' : '#404040';
  const focusBorderColor = '#FFFFFF';
  const bgColor = variant === 'filled' ? '#262626' : '#171717';

  return (
    <div className={`flex flex-col gap-1.5 ${wrapperClassName}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-white flex items-center"
        >
          {label}
          {required && (
            <span className="ml-1 text-white font-bold">*</span>
          )}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative flex items-center group">
        {/* Left icon */}
        {LeftIcon && (
          <div className="absolute left-3 pointer-events-none flex items-center">
            <LeftIcon
              size={16}
              className="text-[#A3A3A3]"
            />
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          {...rest}
          className={[
            'w-full text-sm text-white rounded-xl py-2.5 outline-none transition-all duration-150',
            'placeholder:text-[#737373]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            LeftIcon ? 'pl-10' : 'pl-4',
            (isPassword || rightElement) ? 'pr-10' : 'pr-4',
            className,
          ].join(' ')}
          style={{
            backgroundColor: bgColor,
            border: `1.5px solid ${borderColor}`,
          }}
          onFocus={(e) => {
            e.target.style.borderColor = focusBorderColor;
            e.target.style.boxShadow = '0 0 0 2px rgba(255, 255, 255, 0.2)';
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            e.target.style.borderColor = borderColor;
            e.target.style.boxShadow = 'none';
            rest.onBlur?.(e);
          }}
        />

        {/* Right: password toggle or custom right element */}
        {(isPassword || rightElement) && (
          <div className="absolute right-3 flex items-center">
            {isPassword ? (
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="text-[#A3A3A3] hover:text-white transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            ) : (
              rightElement
            )}
          </div>
        )}
      </div>

      {/* Error or hint */}
      {error ? (
        <div className="flex items-center gap-1.5 text-xs text-white">
          <AlertCircle size={12} />
          <span>{error}</span>
        </div>
      ) : hint ? (
        <p className="text-xs text-[#A3A3A3]">{hint}</p>
      ) : null}
    </div>
  );
});

export default Input;
