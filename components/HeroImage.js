import Image from "next/image";
import Lightbox from "./Lightbox";

function normalizeAspectRatio(ratio) {
  if (!ratio) return "16 / 9";
  if (typeof ratio === "string" && ratio.includes("/") && !ratio.includes(" / ")) {
    const [a, b] = ratio.split("/").map((s) => s.trim());
    if (a && b) return `${a} / ${b}`;
  }
  return ratio;
}

export default function HeroImage({ hero, title }) {
  if (!hero?.image) return null;

  const aspectRatio = normalizeAspectRatio(hero.ratio);
  const alt = hero.alt || title || "Hero image";
  const objectPosition = hero.position || "50% 50%";

  return (
    <figure
      className={[
        "overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/30",
        "transition-transform duration-200 ease-out will-change-transform",
        "hover:scale-[1.01] hover:border-zinc-700",
      ].join(" ")}
    >
      <div className="relative w-full" style={{ aspectRatio }}>
        <Lightbox src={hero.image} alt={alt} className="absolute inset-0 h-full">
          <Image
            src={hero.image}
            alt={alt}
            fill
            priority
            className="object-cover"
            style={{ objectPosition }}
          />
        </Lightbox>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
      </div>

      {hero.caption ? (
        <figcaption className="px-4 py-3 text-sm text-zinc-400 border-t border-zinc-800/70">
          {hero.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
