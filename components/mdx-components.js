import { Link } from "next-view-transitions"
import Lightbox from "./Lightbox";

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
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
    const cls = cx("text-zinc-200 underline underline-offset-4 hover:text-white", props.className);

    if (isInternal) return <Link href={href} {...props} className={cls} />;
    return (
      <a
        href={href}
        {...props}
        className={cls}
        target="_blank"
        rel="noreferrer"
      />
    );
  },
  code: ({ className, ...props }) => {
    // Inline code usually has no className; code blocks usually do.
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
    img: ({ src, alt, className, ...props }) => (
    <Lightbox src={src} alt={alt} className="mt-5">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        {...props}
        className={[
          "block w-full rounded-xl border border-zinc-800 bg-zinc-950/30 shadow-sm",
          "transition-transform duration-200 ease-out",
          "group-hover:scale-[1.01] group-hover:border-zinc-700",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />
    </Lightbox>
  ),
  hr: (props) => <hr {...props} className={cx("my-10 border-zinc-800", props.className)} />,
};
