export const runtime = "nodejs";

export function GET() {
  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    "http://localhost:3000";

  const body = `User-agent: *
Allow: /

Sitemap: ${site}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // cache a bit, but not forever
      "Cache-Control": "public, max-age=3600",
    },
  });
}
