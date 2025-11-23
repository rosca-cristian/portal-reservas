import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PrivacyIndicator from './PrivacyIndicator';

describe('PrivacyIndicator', () => {
  it('renders "Join Available" for public sessions with capacity', () => {
    render(
      <PrivacyIndicator
        privacyOption="public"
        currentCapacity={3}
        maxCapacity={10}
      />
    );

    expect(screen.getByText(/join available/i)).toBeInTheDocument();
    expect(screen.getByText('3/10')).toBeInTheDocument();
  });

  it('renders "Full" for public sessions at capacity', () => {
    render(
      <PrivacyIndicator
        privacyOption="public"
        currentCapacity={10}
        maxCapacity={10}
      />
    );

    expect(screen.getByText(/full/i)).toBeInTheDocument();
  });

  it('renders "Private Session" for private sessions', () => {
    render(
      <PrivacyIndicator
        privacyOption="private"
        currentCapacity={5}
        maxCapacity={10}
      />
    );

    expect(screen.getByText(/private session/i)).toBeInTheDocument();
  });

  it('shows capacity information when provided', () => {
    render(
      <PrivacyIndicator
        privacyOption="public"
        currentCapacity={5}
        maxCapacity={10}
      />
    );

    expect(screen.getByText('5/10')).toBeInTheDocument();
  });

  it('hides label when showLabel is false', () => {
    render(
      <PrivacyIndicator
        privacyOption="public"
        currentCapacity={5}
        maxCapacity={10}
        showLabel={false}
      />
    );

    expect(screen.queryByText(/join available/i)).not.toBeInTheDocument();
    expect(screen.getByText('5/10')).toBeInTheDocument();
  });

  it('renders small size correctly', () => {
    const { container } = render(
      <PrivacyIndicator
        privacyOption="public"
        currentCapacity={5}
        maxCapacity={10}
        size="sm"
      />
    );

    expect(container.firstChild).toHaveClass('text-xs');
  });

  it('renders large size correctly', () => {
    const { container } = render(
      <PrivacyIndicator
        privacyOption="public"
        currentCapacity={5}
        maxCapacity={10}
        size="lg"
      />
    );

    expect(container.firstChild).toHaveClass('text-base');
  });

  it('applies correct styling for public available sessions', () => {
    const { container } = render(
      <PrivacyIndicator
        privacyOption="public"
        currentCapacity={3}
        maxCapacity={10}
      />
    );

    expect(container.firstChild).toHaveClass('bg-green-100', 'text-green-700');
  });

  it('applies correct styling for full sessions', () => {
    const { container } = render(
      <PrivacyIndicator
        privacyOption="public"
        currentCapacity={10}
        maxCapacity={10}
      />
    );

    expect(container.firstChild).toHaveClass('bg-gray-100', 'text-gray-600');
  });

  it('applies correct styling for private sessions', () => {
    const { container } = render(
      <PrivacyIndicator
        privacyOption="private"
      />
    );

    expect(container.firstChild).toHaveClass('bg-gray-100', 'text-gray-600');
  });
});
