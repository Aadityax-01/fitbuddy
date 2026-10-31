import { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';

/**
 * Strict monochrome modal dialog.
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={handleBackdrop}
      aria-modal="true"
      role="dialog"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className={[
          'w-full rounded-2xl outline-none overflow-hidden',
          'animate-[modalIn_0.2s_ease-out_forwards]',
          SIZE_CLASSES[size] || SIZE_CLASSES.md,
        ].join(' ')}
        style={{
          backgroundColor: '#171717',
          border: '1px solid #404040',
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
        }}
      >
        {(title || showClose) && (
          <div
            className="flex items-center justify-between px-6 py-4 border-b border-[#404040]"
          >
            {title && (
              <h2 className="text-white font-black text-lg leading-snug">{title}</h2>
            )}
            {showClose && (
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-[#A3A3A3] hover:text-white hover:bg-[#262626] transition-colors ml-auto"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            )}
          </div>
        )}

        <div className="px-6 py-5">{children}</div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(-8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
