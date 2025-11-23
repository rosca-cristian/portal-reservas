/**
 * SkipLinks Component - Accessibility skip navigation links
 * Story 2.7: Accessibility and Keyboard Navigation
 */

export function SkipLinks() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <a href="#search-results" className="skip-link">
        Skip to search results
      </a>
    </>
  );
}
