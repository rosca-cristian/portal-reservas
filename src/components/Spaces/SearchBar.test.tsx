/**
 * SearchBar Component Tests
 * Story 2.4: Search Bar with Quick Filters
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { SearchBar } from './SearchBar';

describe('SearchBar', () => {
  it('renders search input with placeholder', () => {
    const mockOnChange = vi.fn();
    render(<SearchBar value="" onChange={mockOnChange} />);

    expect(screen.getByPlaceholderText(/search spaces/i)).toBeTruthy();
  });

  it('displays the current value', () => {
    const mockOnChange = vi.fn();
    render(<SearchBar value="test query" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText(/search spaces/i) as HTMLInputElement;
    expect(input.value).toBe('test query');
  });

  it('calls onChange with debounced value', async () => {
    vi.useFakeTimers();
    const mockOnChange = vi.fn();
    const user = userEvent.setup({ delay: null });

    render(<SearchBar value="" onChange={mockOnChange} debounceMs={300} />);

    const input = screen.getByPlaceholderText(/search spaces/i);
    await user.type(input, 'test');

    // Should not call immediately
    expect(mockOnChange).not.toHaveBeenCalled();

    // Advance timers past debounce
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('test');
    });

    vi.useRealTimers();
  });

  it('shows clear button when value is not empty', async () => {
    const mockOnChange = vi.fn();
    const user = userEvent.setup();

    render(<SearchBar value="test" onChange={mockOnChange} />);

    const clearButton = screen.getByLabelText(/clear search/i);
    expect(clearButton).toBeTruthy();

    await user.click(clearButton);
    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('hides clear button when value is empty', () => {
    const mockOnChange = vi.fn();
    render(<SearchBar value="" onChange={mockOnChange} />);

    expect(screen.queryByLabelText(/clear search/i)).toBeNull();
  });

  it('renders search icon', () => {
    const mockOnChange = vi.fn();
    const { container } = render(<SearchBar value="" onChange={mockOnChange} />);

    // Check for lucide Search icon
    const searchIcon = container.querySelector('svg');
    expect(searchIcon).toBeTruthy();
  });
});
