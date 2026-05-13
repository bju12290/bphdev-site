import { Link } from "next-view-transitions"
import { imageSize } from "image-size";
import Lightbox from "./Lightbox";
import Image from "next/image";
import path from "node:path";
import fs from "node:fs";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function getLocalImageDimensions(src) {
  if (!src || typeof src !== "string") return null;
  if (!src.startsWith("/")) return null; // only local public assets

  // Strip query/hash to map to filesystem path
  const clean = src.split("?")[0].split("#")[0];
  const filePath = path.join(process.cwd(), "public", clean);

  if (!fs.existsSync(filePath)) return null;

  try {
    const { width, height } = imageSize(filePath);
    if (!width || !height) return null;
    return { width, height };
  } catch {
    return null;
  }
}

function toNumberMaybe(v) {
  if (v == null) return null;
  const n = typeof v === "number" ? v : Number(String(v));
  return Number.isFinite(n) ? n : null;
}

export const mdxComponents = {
  h2: (props) => (
    <h2
      {...props}
      className={cx("mt-10 text-2xl font-semibold tracking-tight", props.className)}
    />
  ),
  h3: (props) => (
    <h3
      {...props}
      className={cx("mt-8 text-xl font-semibold tracking-tight", props.className)}
    />
  ),
  p: (props) => (
    <p
      {...props}
      className={cx("mt-4 leading-7 text-zinc-300", props.className)}
    />
  ),
  ul: (props) => (
    <ul
      {...props}
      className={cx("mt-4 ml-6 list-disc space-y-2 text-zinc-300", props.className)}
    />
  ),
  ol: (props) => (
    <ol
      {...props}
      className={cx("mt-4 ml-6 list-decimal space-y-2 text-zinc-300", props.className)}
    />
  ),
  li: (props) => <li {...props} className={cx("pl-1", props.className)} />,
  a: ({ href = "", ...props }) => {
    const isInternal = href.startsWith("/");
    const isHash = href.startsWith("#");
    const isMailOrTel = href.startsWith("mailto:") || href.startsWith("tel:");
    const cls = cx("text-zinc-200 underline underline-offset-4 hover:text-white", props.className);

    if (isInternal) return <Link href={href} {...props} className={cls} />;
    if (isHash || isMailOrTel) return <a href={href} {...props} className={cls} />;

    return (
      <a
        href={href}
        {...props}
        className={cls}
        target="_blank"
        rel="noopener noreferrer"
      />
    );
  },
  code: ({ className, ...props }) => {
    const inline = !className;
    return (
      <code
        {...props}
        className={cx(
          inline && "rounded bg-zinc-900 px-1 py-0.5 text-zinc-200",
          className
        )}
      />
    );
  },
  pre: (props) => (
    <pre
      {...props}
      className={cx(
        "mt-5 overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-sm leading-6 text-zinc-200",
        props.className
      )}
    />
  ),
  blockquote: (props) => (
    <blockquote
      {...props}
      className={cx(
        "mt-5 border-l-2 border-zinc-700 pl-4 text-zinc-300",
        props.className
      )}
    />
  ),
    img: ({ src, alt, className, ...props }) => {
      if (!src) return null;

      // If the author explicitly set width/height in MDX (rare), respect it.
      const explicitW = toNumberMaybe(props.width);
      const explicitH = toNumberMaybe(props.height);

      const inferred = !explicitW || !explicitH ? getLocalImageDimensions(src) : null;
      const width = explicitW && explicitH ? explicitW : inferred?.width;
      const height = explicitW && explicitH ? explicitH : inferred?.height;

      const sharedClass = [
        "block w-full rounded-xl border border-zinc-800 bg-zinc-950/30 shadow-sm",
        "transition-transform duration-200 ease-out",
        "group-hover:scale-[1.01] group-hover:border-zinc-700",
        "h-auto", // important for responsive sizing
        className,
      ]
        .filter(Boolean)
        .join(" ");

      // Remote images (or locals we can't size) fall back to <img>
      const canUseNextImage = Boolean(width && height);

      return (
        <Lightbox src={src} alt={alt} className="mt-5">
          {canUseNextImage ? (
            <Image
              src={src}
              alt={alt || ""}
              width={width}
              height={height}
              sizes="(min-width: 1024px) 980px, 100vw"
              className={sharedClass}
              // Next already lazy-loads by default (unless priority)
            />
          ) : (
            <img
              src={src}
              alt={alt}
              loading="lazy"
              {...props}
              className={sharedClass}
            />
          )}
        </Lightbox>
      );
    },
  hr: (props) => <hr {...props} className={cx("my-10 border-zinc-800", props.className)} />,
};
