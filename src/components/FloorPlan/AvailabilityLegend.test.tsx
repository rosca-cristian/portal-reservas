/**
 * AvailabilityLegend Component Tests
 * Story 2.2: Real-Time Availability Overlay
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AvailabilityLegend } from './AvailabilityLegend';

describe('AvailabilityLegend', () => {
  it('renders legend title', () => {
    render(<AvailabilityLegend />);

    expect(screen.getByText(/availability legend/i)).toBeTruthy();
  });

  it('shows all availability statuses', () => {
    render(<AvailabilityLegend />);

    expect(screen.getByText(/^Available$/i)).toBeTruthy();
    expect(screen.getByText(/^Occupied$/i)).toBeTruthy();
    expect(screen.getByText(/^Unavailable$/i)).toBeTruthy();
  });

  it('displays descriptions for each status', () => {
    render(<AvailabilityLegend />);

    expect(screen.getByText(/space is free to book/i)).toBeTruthy();
    expect(screen.getByText(/currently in use/i)).toBeTruthy();
    expect(screen.getByText(/closed or under maintenance/i)).toBeTruthy();
  });

  it('renders color indicators', () => {
    const { container } = render(<AvailabilityLegend />);

    // Should have 3 color indicators (one for each status)
    const colorDivs = container.querySelectorAll('.w-4.h-4.rounded');
    expect(colorDivs.length).toBe(3);
  });
});
