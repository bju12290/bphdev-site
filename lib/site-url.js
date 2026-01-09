// lib/site-url.js
// Centralized canonical site URL resolver.
// - In production on Vercel, set NEXT_PUBLIC_SITE_URL to canonical custom domain - https://bphdev.com
// - In preview deployments, VERCEL_URL is used automatically (e.g. https://your-project-git-branch.vercel.app)
// - In local dev, falls back to http://localhost:3000

function normalize(url) {
  const trimmed = String(url || "").trim();

  // If someone sets "bphdev.com" without protocol, assume https.
  const withProtocol =
    /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  return withProtocol.replace(/\/+$/, "");
}

export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return normalize(explicit);

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return normalize(`https://${vercel}`);

  // Local dev / fallback
  return "http://localhost:3000";
}
