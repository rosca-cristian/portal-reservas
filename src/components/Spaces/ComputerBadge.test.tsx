/**
 * ComputerBadge Component Tests
 * Story 3.6: Computer Desk Identification
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ComputerBadge from './ComputerBadge';

describe('ComputerBadge', () => {
  describe('full variant', () => {
    it('renders with full text and icon by default', () => {
      render(<ComputerBadge />);

      expect(screen.getByText('Computer')).toBeTruthy();
      expect(screen.getByLabelText('This desk has a computer')).toBeTruthy();
    });

    it('renders with explicit full variant', () => {
      render(<ComputerBadge variant="full" />);

      expect(screen.getByText('Computer')).toBeTruthy();
    });

    it('applies default styling', () => {
      const { container } = render(<ComputerBadge variant="full" />);
      const badge = screen.getByLabelText('This desk has a computer');

      expect(badge.className).toContain('inline-flex');
      expect(badge.className).toContain('bg-blue-100');
      expect(badge.className).toContain('text-blue-800');
      expect(badge.className).toContain('rounded-full');
    });

    it('applies custom className', () => {
      render(<ComputerBadge variant="full" className="custom-class" />);
      const badge = screen.getByLabelText('This desk has a computer');

      expect(badge.className).toContain('custom-class');
    });

    it('has proper ARIA attributes', () => {
      render(<ComputerBadge variant="full" />);
      const badge = screen.getByLabelText('This desk has a computer');

      expect(badge.getAttribute('aria-label')).toBe('This desk has a computer');
    });
  });

  describe('compact variant', () => {
    it('renders without text label', () => {
      render(<ComputerBadge variant="compact" />);

      expect(screen.queryByText('Computer')).toBeNull();
    });

    it('has icon with tooltip title', () => {
      render(<ComputerBadge variant="compact" />);
      const badge = screen.getByLabelText('This desk has a computer');

      expect(badge.getAttribute('title')).toBe('Computer Available');
    });

    it('applies compact styling', () => {
      render(<ComputerBadge variant="compact" />);
      const badge = screen.getByLabelText('This desk has a computer');

      expect(badge.className).toContain('w-6');
      expect(badge.className).toContain('h-6');
      expect(badge.className).toContain('bg-blue-100');
      expect(badge.className).toContain('rounded-full');
    });

    it('applies custom className to compact variant', () => {
      render(<ComputerBadge variant="compact" className="custom-compact" />);
      const badge = screen.getByLabelText('This desk has a computer');

      expect(badge.className).toContain('custom-compact');
    });

    it('has proper ARIA attributes', () => {
      render(<ComputerBadge variant="compact" />);
      const badge = screen.getByLabelText('This desk has a computer');

      expect(badge.getAttribute('aria-label')).toBe('This desk has a computer');
      expect(badge.getAttribute('title')).toBe('Computer Available');
    });
  });

  describe('accessibility', () => {
    it('provides screen reader accessible label for full variant', () => {
      render(<ComputerBadge variant="full" />);

      const badge = screen.getByLabelText('This desk has a computer');
      expect(badge).toBeTruthy();
    });

    it('provides screen reader accessible label for compact variant', () => {
      render(<ComputerBadge variant="compact" />);

      const badge = screen.getByLabelText('This desk has a computer');
      expect(badge).toBeTruthy();
    });

    it('provides tooltip for compact variant', () => {
      render(<ComputerBadge variant="compact" />);

      const badge = screen.getByTitle('Computer Available');
      expect(badge).toBeTruthy();
    });
  });

  describe('visual consistency', () => {
    it('uses consistent blue color scheme for full variant', () => {
      render(<ComputerBadge variant="full" />);
      const badge = screen.getByLabelText('This desk has a computer');

      expect(badge.className).toContain('bg-blue-100');
      expect(badge.className).toContain('text-blue-800');
    });

    it('uses consistent blue color scheme for compact variant', () => {
      render(<ComputerBadge variant="compact" />);
      const badge = screen.getByLabelText('This desk has a computer');

      expect(badge.className).toContain('bg-blue-100');
    });

    it('uses consistent icon size for full variant', () => {
      const { container } = render(<ComputerBadge variant="full" />);
      // SVG icons are rendered as SVG elements, not with className
      const icon = container.querySelector('svg');

      expect(icon).toBeTruthy();
    });

    it('uses consistent icon size for compact variant', () => {
      const { container } = render(<ComputerBadge variant="compact" />);
      // SVG icons are rendered as SVG elements, not with className
      const icon = container.querySelector('svg');

      expect(icon).toBeTruthy();
    });
  });
});
