import { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

/**
 * Dark overlay modal with animated entrance.
 *
 * @param {{
 *   isOpen: boolean,
 *   onClose: () => void,
 *   title?: string,
 *   children: React.ReactNode,
 *   size?: 'sm' | 'md' | 'lg' | 'xl' | 'full',
 *   showClose?: boolean,
 *   closeOnBackdrop?: boolean,
 * }} props
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showClose = true,
  closeOnBackdrop = true,
}) {
  const dialogRef = useRef(null);

  // Handle Escape key
  const handleKey = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose?.();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKey]);

  // Focus trap on open
  useEffect(() => {
    if (isOpen) dialogRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  const SIZE_CLASSES = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  function handleBackdrop(e) {
    if (closeOnBackdrop && e.target === e.currentTarget) onClose?.();
  }

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={handleBackdrop}
      aria-modal="true"
      role="dialog"
    >
      {/* Panel */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={[
          'w-full rounded-2xl outline-none overflow-hidden',
          'animate-[modalIn_0.2s_ease-out_forwards]',
          SIZE_CLASSES[size] || SIZE_CLASSES.md,
        ].join(' ')}
        style={{
          backgroundColor: '#111111',
          border: '1px solid #1a1a1a',
          boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
        }}
      >
        {/* Header */}
        {(title || showClose) && (
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: '#1a1a1a' }}
          >
            {title && (
              <h2 className="text-white font-semibold text-lg leading-snug">{title}</h2>
            )}
            {showClose && (
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-gray-500 hover:text-white hover:bg-white/5 transition-colors ml-auto"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>

      {/* Keyframe animation injected via style tag */}
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(-8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
