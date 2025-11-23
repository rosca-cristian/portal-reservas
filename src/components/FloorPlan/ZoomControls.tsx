/**
 * ZoomControls Component - Zoom in/out/reset buttons for floor plan
 * Story 2.1: Interactive SVG Floor Plan Component
 */

import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

// Simple button component (temporary - will use shadcn/ui later)
const Button = ({ children, onClick, className, title, ...props }: any) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-md hover:bg-white/20 transition-colors ${className}`}
    title={title}
    {...props}
  >
    {children}
  </button>
);

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export function ZoomControls({
  onZoomIn,
  onZoomOut,
  onReset,
}: ZoomControlsProps) {
  return (
    <div className="zoom-controls absolute top-4 right-4 z-10 flex flex-col gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomIn}
        className="glassmorphism hover:bg-white/80"
        title="Zoom In"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomOut}
        className="glassmorphism hover:bg-white/80"
        title="Zoom Out"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onReset}
        className="glassmorphism hover:bg-white/80"
        title="Reset Zoom"
      >
        <Maximize2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
