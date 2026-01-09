// lib/content.js
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

function readFiles(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
}

function parseFile(fullPath) {
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  return { data, content };
}

function loadCollection(relativeDir, options = {}) {
  const { includeUnlisted = false, includePrivate = false } = options;

  const dirPath = path.join(process.cwd(), relativeDir);
  const files = readFiles(dirPath);

  const items = files.map((filename) => {
    const fullPath = path.join(dirPath, filename);
    const { data, content } = parseFile(fullPath);

    const fallbackSlug = filename.replace(/\.(md|mdx)$/, "");
    const slug = data.slug || fallbackSlug;

    return {
      ...data,
      slug,
      body: content,
      _filename: filename,
    };
  });

  // Visibility rules:
  // - public: shows up everywhere
  // - unlisted: direct link only (not listed)
  // - private: hidden (no routes/listings)
  const visible = items.filter((x) => {
    const v = x.visibility || "public";
    if (includePrivate) return true;
    if (includeUnlisted) return v !== "private";
    return v === "public";
  });

  // sort: featured first, then date desc, then title
  visible.sort((a, b) => {
    const af = a.featured ? 1 : 0;
    const bf = b.featured ? 1 : 0;
    if (af !== bf) return bf - af;

    const ad = a.date ? Date.parse(a.date) : 0;
    const bd = b.date ? Date.parse(b.date) : 0;
    if (ad !== bd) return bd - ad;

    return String(a.title || "").localeCompare(String(b.title || ""));
  });

  return visible;
}

export function getProjects(options) {
  return loadCollection("content/projects", options);
}

export function getPosts(options) {
  return loadCollection("content/writing", options);
}

export function getProjectBySlug(slug) {
  // allow public + unlisted (direct-link), but never private
  return (
    getProjects({ includeUnlisted: true }).find((p) => p.slug === slug) || null
  );
}

export function getPostBySlug(slug) {
  // allow public + unlisted (direct-link), but never private
  return (
    getPosts({ includeUnlisted: true }).find((p) => p.slug === slug) || null
  );
}
