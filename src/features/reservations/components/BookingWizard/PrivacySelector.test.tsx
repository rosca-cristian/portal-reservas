import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useReservationsStore } from '../../stores/reservationsStore';
import PrivacySelector from './PrivacySelector';

describe('PrivacySelector', () => {
  beforeEach(() => {
    useReservationsStore.getState().resetWizard();
  });

  it('renders public and private options', () => {
    render(<PrivacySelector />);

    expect(screen.getByLabelText(/public/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/private/i)).toBeInTheDocument();
  });

  it('defaults to public option', () => {
    render(<PrivacySelector />);

    const publicRadio = screen.getByRole('radio', { name: /public/i });
    expect(publicRadio).toBeChecked();
  });

  it('displays descriptions for each option', () => {
    render(<PrivacySelector />);

    expect(screen.getByText(/other users can discover and join this session/i)).toBeInTheDocument();
    expect(screen.getByText(/only users with the invitation link can join/i)).toBeInTheDocument();
  });

  it('updates store when private is selected', async () => {
    const user = userEvent.setup();
    render(<PrivacySelector />);

    const privateRadio = screen.getByRole('radio', { name: /private/i });
    await user.click(privateRadio);

    expect(useReservationsStore.getState().wizard.privacyOption).toBe('private');
  });

  it('updates store when public is selected after private', async () => {
    const user = userEvent.setup();
    useReservationsStore.getState().setPrivacyOption('private');
    render(<PrivacySelector />);

    const publicRadio = screen.getByRole('radio', { name: /public/i });
    await user.click(publicRadio);

    expect(useReservationsStore.getState().wizard.privacyOption).toBe('public');
  });

  it('highlights selected option', () => {
    useReservationsStore.getState().setPrivacyOption('private');
    render(<PrivacySelector />);

    const privateLabel = screen.getByRole('radio', { name: /private/i }).closest('label');
    expect(privateLabel).toHaveClass('border-blue-500');
  });
});
