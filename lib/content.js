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

function loadCollection(relativeDir) {
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

  // hide private content by default
  const visible = items.filter((x) => (x.visibility || "public") !== "private");

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

export function getProjects() {
  return loadCollection("content/projects");
}

export function getPosts() {
  return loadCollection("content/writing");
}

export function getProjectBySlug(slug) {
  return getProjects().find((p) => p.slug === slug) || null;
}

export function getPostBySlug(slug) {
  return getPosts().find((p) => p.slug === slug) || null;
}
