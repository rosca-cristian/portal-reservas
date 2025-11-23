/**
 * SearchBar Component - Search input with debouncing
 * Story 2.4: Search Bar with Quick Filters
 */

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search spaces by name...',
  debounceMs = 300,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Sync with external value changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce the onChange callback
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, onChange, debounceMs]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="search-bar relative">
      <div
        className="relative flex items-center gap-3"
        style={{
          background: 'linear-gradient(145deg, #ffffff, #ececec)',
          borderRadius: '30px',
          padding: '16px 24px',
          boxShadow: `
            8px 8px 16px rgba(163, 177, 198, 0.4),
            -8px -8px 16px rgba(255, 255, 255, 0.9),
            inset 2px 2px 4px rgba(255, 255, 255, 0.5)
          `,
          transition: 'all 0.3s ease'
        }}
      >
        <Search
          className="h-5 w-5"
          style={{ color: '#7f8c8d' }}
        />
        <input
          type="text"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none font-semibold"
          style={{
            color: '#1a1a2e',
            fontSize: '1rem'
          }}
          onFocus={(e) => {
            e.currentTarget.parentElement!.style.boxShadow = `
              inset 4px 4px 8px rgba(163, 177, 198, 0.3),
              inset -2px -2px 6px rgba(255, 255, 255, 0.8),
              8px 8px 20px rgba(107, 159, 219, 0.3)
            `;
          }}
          onBlur={(e) => {
            e.currentTarget.parentElement!.style.boxShadow = `
              8px 8px 16px rgba(163, 177, 198, 0.4),
              -8px -8px 16px rgba(255, 255, 255, 0.9),
              inset 2px 2px 4px rgba(255, 255, 255, 0.5)
            `;
          }}
        />
        {localValue && (
          <button
            onClick={handleClear}
            className="p-1 rounded-full transition-all duration-200"
            aria-label="Clear search"
            style={{
              background: 'linear-gradient(145deg, #FFB6B6, #FF9999)',
              color: 'white',
              boxShadow: '4px 4px 8px rgba(255, 150, 150, 0.3), -4px -4px 8px rgba(255, 255, 255, 0.9)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
