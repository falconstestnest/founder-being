/**
 * Luma embed safety — only trusted HTTPS Luma hosts.
 */

const ALLOWED_HOSTS = new Set(["luma.com", "www.luma.com", "lu.ma", "www.lu.ma"]);

export function isTrustedLumaEmbedUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    if (!ALLOWED_HOSTS.has(u.hostname)) return false;
    // Embed paths only
    return (
      u.pathname.includes("/embed/event/") ||
      u.pathname.includes("/embed/checkout/")
    );
  } catch {
    return false;
  }
}

export function isTrustedLumaPublicUrl(url: string): boolean {
  try {
    const u = new URL(url);
    if (u.protocol !== "https:") return false;
    return ALLOWED_HOSTS.has(u.hostname);
  } catch {
    return false;
  }
}
