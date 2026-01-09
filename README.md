# Portfolio Site

A fast, MDX-driven portfolio/case study site built with the Next.js App Router. Content lives in-repo (no CMS), projects and writing notes render from `content/*`, and the UI leans into “nice vibes” without melting weaker machines.

## Tech stack

- **Next.js (App Router)** + **React**
- **MDX content pipeline**: `gray-matter` frontmatter + `next-mdx-remote` (`compileMDX`)
- **Code highlighting**: `rehype-pretty-code` + **Shiki**
- **Styling**: **Tailwind CSS**
- **Transitions**: `next-view-transitions` (native View Transitions when supported)

## Features worth stealing

- **MDX as your CMS**: projects + posts live in `content/` with frontmatter (title, tags, stack, etc.)
- **Visibility controls**: `public | unlisted | private` (unlisted = direct-link only)
- **Pretty code blocks** via Shiki + `rehype-pretty-code`
- **Image UX**:
  - MDX `<Image />` wrapper that infers local dimensions when possible (reduces layout shift)
  - Lightbox with keyboard support + scroll locking
- **SEO plumbing**:
  - `robots.txt`, `sitemap.xml`, and `rss.xml` route handlers
  - Open Graph + JSON-LD helpers in `lib/`
- **Performance-friendly “fancy”**:
  - animated fluid backdrop that respects reduced-motion and tries to avoid running on low-power configs
- **Security headers** in `next.config.mjs` (nosniff, frame denial, conservative permissions policy, etc.)

## Local development

```bash
npm install
npm run dev
```

Build + run production:

```bash
npm run build
npm start
```

## Writing content (MDX)

### Projects
- Add files to: `content/projects/*.mdx`
- Template: `content/_templates/project.template.mdx`

### Writing / notes
- Add files to: `content/writing/*.mdx`
- Template: `content/_templates/post.template.mdx`

### Frontmatter conventions

Most pages use some subset of these:

- `title` (string)
- `slug` (string)
- `summary` (string)
- `date` (ISO string, e.g. `"2025-12-27"`)
- `tags` (string[])
- `stack` (string[])
- `featured` (boolean)
- `status` (`shipped | maintained | archived | wip`)
- `visibility` (`public | unlisted | private`)
- `links` (object: `demo`, `repo`, etc.)
- `hero` (object: `image`, `alt`)

### Visibility rules

Content is filtered in `lib/content.js`:

- **public**: listed + routable
- **unlisted**: routable, but **not** listed on index pages
- **private**: not listed and not routable (effectively hidden)

## Repo structure (high level)

- `app/` – Next.js routes (home, projects, writing, plus `rss.xml`, `sitemap.xml`, `robots.txt`)
- `components/` – UI components (MDX components, lightbox, backdrop, etc.)
- `content/` – MDX content (projects + writing) and templates
- `lib/` – content loading, site URL helpers, structured data helpers
- `public/` – static assets (OG image, project images, etc.)

## Notes

- The RSS/sitemap/robots endpoints are implemented as App Router route handlers under `app/*/route.js`.
- If you add heavy visuals, keep the “be nice to low-end machines” ethos: respect `prefers-reduced-motion`, pause when the tab is hidden, and avoid unnecessary reflows.
