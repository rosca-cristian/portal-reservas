/**
 * Generate invitation URL from token
 * @param token - The invitation token (UUID)
 * @returns Full invitation URL
 */
export function generateInvitationUrl(token: string): string {
  const baseUrl = window.location.origin;
  return `${baseUrl}/join/${token}`;
}

/**
 * Validate invitation token format (UUID v4)
 * @param token - Token to validate
 * @returns True if valid UUID format
 */
export function isValidInvitationToken(token: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(token);
}
