/**
 * Modal Component - Basic dialog/modal foundation
 * Story 2.6: Space Details Modal
 */

import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className = '' }: ModalProps) {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key and focus management
  useEffect(() => {
    if (isOpen) {
      // Save current focus
      previousFocusRef.current = document.activeElement as HTMLElement;

      // Focus modal
      setTimeout(() => modalRef.current?.focus(), 0);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    } else {
      // Restore focus when modal closes
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      style={{
        background: 'rgba(26, 26, 46, 0.7)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div
        ref={modalRef}
        className={`rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col ${className}`}
        tabIndex={-1}
        style={{
          background: 'linear-gradient(145deg, #F0F9FF, #F0FFF9)',
          boxShadow: `
            20px 20px 60px rgba(0, 0, 0, 0.3),
            -20px -20px 60px rgba(255, 255, 255, 0.8)
          `
        }}
      >
        {/* Header */}
        {title && (
          <div
            className="flex items-center justify-between p-6"
            style={{
              borderBottom: '2px solid rgba(139, 219, 219, 0.2)'
            }}
          >
            <h2
              id="modal-title"
              className="text-2xl font-extrabold"
              style={{
                color: '#1a1a2e',
                textShadow: '2px 2px 4px rgba(255,255,255,0.8), -1px -1px 2px rgba(0,0,0,0.1)'
              }}
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full transition-all duration-200"
              aria-label="Close modal"
              style={{
                background: 'linear-gradient(145deg, #FFB6B6, #FF9999)',
                color: 'white',
                boxShadow: '6px 6px 12px rgba(255, 150, 150, 0.3), -6px -6px 12px rgba(255, 255, 255, 0.9)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '8px 8px 16px rgba(255, 150, 150, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.95)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '6px 6px 12px rgba(255, 150, 150, 0.3), -6px -6px 12px rgba(255, 255, 255, 0.9)';
              }}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
