/**
 * SkipLinks Component Tests
 * Story 2.7: Accessibility and Keyboard Navigation
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SkipLinks } from './SkipLinks';

describe('SkipLinks', () => {
  it('renders skip to main content link', () => {
    render(<SkipLinks />);
    expect(screen.getByText('Skip to main content')).toBeTruthy();
  });

  it('renders skip to search results link', () => {
    render(<SkipLinks />);
    expect(screen.getByText('Skip to search results')).toBeTruthy();
  });

  it('has correct href for main content', () => {
    render(<SkipLinks />);
    const link = screen.getByText('Skip to main content');
    expect(link.getAttribute('href')).toBe('#main-content');
  });

  it('has correct href for search results', () => {
    render(<SkipLinks />);
    const link = screen.getByText('Skip to search results');
    expect(link.getAttribute('href')).toBe('#search-results');
  });

  it('has skip-link class for styling', () => {
    render(<SkipLinks />);
    const link = screen.getByText('Skip to main content');
    expect(link.className).toContain('skip-link');
  });
});
