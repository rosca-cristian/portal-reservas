/**
 * Mock for react-zoom-pan-pinch library
 * Used in tests to avoid TransformComponent errors
 */

import type { ReactNode } from 'react';

interface TransformWrapperProps {
  children: (utils: {
    zoomIn: () => void;
    zoomOut: () => void;
    resetTransform: () => void;
  }) => ReactNode;
  initialScale?: number;
  minScale?: number;
  maxScale?: number;
  wheel?: { step: number };
  pinch?: { step: number };
  doubleClick?: { disabled: boolean };
}

interface TransformComponentProps {
  children: ReactNode;
  wrapperClass?: string;
  contentClass?: string;
}

export const TransformWrapper = ({ children }: TransformWrapperProps) => {
  const mockUtils = {
    zoomIn: () => {},
    zoomOut: () => {},
    resetTransform: () => {},
  };

  return <>{children(mockUtils)}</>;
};

export const TransformComponent = ({ children, wrapperClass, contentClass }: TransformComponentProps) => {
  return (
    <div className={`${wrapperClass} ${contentClass}`}>
      {children}
    </div>
  );
};
