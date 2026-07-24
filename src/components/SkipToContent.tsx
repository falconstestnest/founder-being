/**
 * Accessibility skip link.
 * Hidden off-screen by default; visible only on :focus-visible (keyboard Tab).
 * Never use :focus + not-sr-only — that shows after client-side nav focus restore.
 */
export function SkipToContent() {
  return (
    <a href="#main-content" className="skip-link">
      Skip to content
    </a>
  );
}
