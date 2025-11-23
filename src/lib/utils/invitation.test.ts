import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { generateInvitationUrl, isValidInvitationToken } from './invitation';

describe('generateInvitationUrl', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    delete (window as any).location;
    window.location = { origin: 'https://example.com' } as any;
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it('generates correct invitation URL', () => {
    const token = '123e4567-e89b-12d3-a456-426614174000';
    const url = generateInvitationUrl(token);
    expect(url).toBe('https://example.com/join/123e4567-e89b-12d3-a456-426614174000');
  });

  it('uses current window origin', () => {
    window.location = { origin: 'http://localhost:5173' } as any;
    const token = 'test-token';
    const url = generateInvitationUrl(token);
    expect(url).toBe('http://localhost:5173/join/test-token');
  });
});

describe('isValidInvitationToken', () => {
  it('validates correct UUID v4 format', () => {
    const validToken = '123e4567-e89b-42d3-a456-426614174000';
    expect(isValidInvitationToken(validToken)).toBe(true);
  });

  it('rejects invalid UUID format', () => {
    const invalidTokens = [
      'invalid-token',
      '12345',
      '123e4567-e89b-12d3-a456', // incomplete
      'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', // non-hex
    ];

    invalidTokens.forEach(token => {
      expect(isValidInvitationToken(token)).toBe(false);
    });
  });

  it('validates UUIDs are version 4', () => {
    // UUID v4 has '4' in the third group
    const validV4 = '123e4567-e89b-42d3-a456-426614174000';
    const invalidV1 = '123e4567-e89b-12d3-a456-426614174000';

    expect(isValidInvitationToken(validV4)).toBe(true);
    expect(isValidInvitationToken(invalidV1)).toBe(false);
  });

  it('is case insensitive', () => {
    const uppercase = '123E4567-E89B-42D3-A456-426614174000';
    const lowercase = '123e4567-e89b-42d3-a456-426614174000';

    expect(isValidInvitationToken(uppercase)).toBe(true);
    expect(isValidInvitationToken(lowercase)).toBe(true);
  });
});
