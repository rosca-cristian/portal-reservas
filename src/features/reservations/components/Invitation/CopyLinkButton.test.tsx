import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import CopyLinkButton from './CopyLinkButton';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('CopyLinkButton', () => {
  const mockUrl = 'https://example.com/join/test-token';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders copy button', () => {
    render(<CopyLinkButton url={mockUrl} />);
    expect(screen.getByRole('button', { name: /copy link/i })).toBeInTheDocument();
  });

  it('copies link to clipboard when clicked', async () => {
    const user = userEvent.setup();
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });

    render(<CopyLinkButton url={mockUrl} />);

    const button = screen.getByRole('button', { name: /copy link/i });
    await user.click(button);

    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledWith(mockUrl);
      expect(toast.success).toHaveBeenCalledWith('Link copied to clipboard!');
    });
  });

  it('shows copied state after successful copy', async () => {
    const user = userEvent.setup();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    render(<CopyLinkButton url={mockUrl} />);

    const button = screen.getByRole('button', { name: /copy link/i });
    await user.click(button);

    await waitFor(() => {
      expect(screen.getByText(/copied!/i)).toBeInTheDocument();
    });
  });

  it('handles clipboard API failure gracefully', async () => {
    const user = userEvent.setup();
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockRejectedValue(new Error('Clipboard error')),
      },
    });

    render(<CopyLinkButton url={mockUrl} />);

    const button = screen.getByRole('button', { name: /copy link/i });
    await user.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to copy link');
    });
  });
});
