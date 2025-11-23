/**
 * ViewToggle Component - Toggle between floor plan and grid view
 * Story 2.3: Space Card Component and Grid View
 */

import { LayoutGrid, Map } from 'lucide-react';

export type ViewMode = 'floor-plan' | 'grid';

interface ViewToggleProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div
      className="view-toggle inline-flex gap-2 p-2"
      style={{
        background: 'linear-gradient(145deg, #F0F9FF, #F0FFF9)',
        borderRadius: '25px',
        boxShadow: `
          8px 8px 16px rgba(133, 196, 219, 0.3),
          -8px -8px 16px rgba(255, 255, 255, 0.9)
        `
      }}
    >
      <button
        onClick={() => onViewChange('floor-plan')}
        className="px-5 py-2.5 rounded-full flex items-center gap-2 transition-all duration-300 font-bold text-sm"
        style={
          view === 'floor-plan'
            ? {
              background: 'linear-gradient(145deg, #8BDBDB, #6FB8B8)',
              color: 'white',
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
              boxShadow: `
                  inset 3px 3px 6px rgba(0,0,0,0.15),
                  inset -3px -3px 6px rgba(139,219,219,0.3),
                  6px 6px 12px rgba(111, 184, 184, 0.5)
                `
            }
            : {
              background: 'transparent',
              color: '#1a1a2e',
              boxShadow: 'none'
            }
        }
        aria-label="Floor plan view"
        onMouseEnter={(e) => {
          if (view !== 'floor-plan') {
            e.currentTarget.style.background = 'linear-gradient(145deg, rgba(139, 219, 219, 0.2), rgba(111, 184, 184, 0.2))';
          }
        }}
        onMouseLeave={(e) => {
          if (view !== 'floor-plan') {
            e.currentTarget.style.background = 'transparent';
          }
        }}
      >
        <Map className="h-4 w-4" />
        <span className="hidden sm:inline">Floor Plan</span>
      </button>
      <button
        onClick={() => onViewChange('grid')}
        className="px-5 py-2.5 rounded-full flex items-center gap-2 transition-all duration-300 font-bold text-sm"
        style={
          view === 'grid'
            ? {
              background: 'linear-gradient(145deg, #8BDBDB, #6FB8B8)',
              color: 'white',
              textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
              boxShadow: `
                  inset 3px 3px 6px rgba(0,0,0,0.15),
                  inset -3px -3px 6px rgba(139,219,219,0.3),
                  6px 6px 12px rgba(111, 184, 184, 0.5)
                `
            }
            : {
              background: 'transparent',
              color: '#1a1a2e',
              boxShadow: 'none'
            }
        }
        aria-label="Grid view"
        onMouseEnter={(e) => {
          if (view !== 'grid') {
            e.currentTarget.style.background = 'linear-gradient(145deg, rgba(139, 219, 219, 0.2), rgba(111, 184, 184, 0.2))';
          }
        }}
        onMouseLeave={(e) => {
          if (view !== 'grid') {
            e.currentTarget.style.background = 'transparent';
          }
        }}
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="hidden sm:inline">Grid</span>
      </button>
    </div>
  );
}
