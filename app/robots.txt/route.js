export const runtime = "nodejs";

import { getSiteUrl } from "../../lib/site-url"
export function GET() {
  const site = getSiteUrl();

  const body = `User-agent: *
Allow: /

Sitemap: ${site}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
