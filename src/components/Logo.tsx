import Image from "next/image";

/**
 * Founder-Being brand mark component.
 *
 * - `lockup-*` → single exported stacked lockup PNG
 * - `monogram-*` / `wordmark-*` → single exported assets
 * - `nav-white` / `nav-gold` → intentional horizontal nav treatment
 *   (monogram + horizontal wordmark). Used only in the sticky header.
 */
export type LogoVariant =
  | "lockup-white"
  | "lockup-gold"
  | "lockup-black"
  | "monogram-white"
  | "monogram-gold"
  | "monogram-black"
  | "wordmark-white"
  | "wordmark-gold"
  | "wordmark-black"
  | "nav-white"
  | "nav-gold";

type LogoProps = {
  className?: string;
  variant?: LogoVariant;
  /** Display height in CSS pixels (for nav: monogram height). */
  height?: number;
  priority?: boolean;
};

const ASSETS = {
  "lockup-white": {
    src: "/brand/lockup-white.png",
    width: 534,
    height: 640,
  },
  "lockup-gold": {
    src: "/brand/lockup-gold.png",
    width: 534,
    height: 640,
  },
  "lockup-black": {
    src: "/brand/lockup-black.png",
    width: 529,
    height: 640,
  },
  "monogram-white": {
    src: "/brand/monogram-white.png",
    width: 1762,
    height: 2119,
  },
  "monogram-gold": {
    src: "/brand/monogram-gold.png",
    width: 1762,
    height: 2119,
  },
  "monogram-black": {
    src: "/brand/monogram-black.png",
    width: 1762,
    height: 2119,
  },
  "wordmark-white": {
    src: "/brand/wordmark-white.png",
    width: 2459,
    height: 222,
  },
  "wordmark-gold": {
    src: "/brand/wordmark-gold.png",
    width: 2459,
    height: 222,
  },
  "wordmark-black": {
    src: "/brand/wordmark-black.png",
    width: 2459,
    height: 222,
  },
} as const;

function SingleLogo({
  src,
  intrinsicW,
  intrinsicH,
  height,
  priority,
  className,
  alt,
}: {
  src: string;
  intrinsicW: number;
  intrinsicH: number;
  height: number;
  priority?: boolean;
  className?: string;
  alt: string;
}) {
  const width = Math.round((height * intrinsicW) / intrinsicH);
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={`h-auto w-auto select-none ${className ?? ""}`}
      style={{ height, width: "auto" }}
      sizes={`${width}px`}
    />
  );
}

/** Horizontal nav lockup: monogram + FOUNDER-BEING wordmark side by side. */
function NavLogo({
  monogramSrc,
  wordmarkSrc,
  height,
  priority,
  className,
}: {
  monogramSrc: string;
  wordmarkSrc: string;
  height: number;
  priority?: boolean;
  className?: string;
}) {
  const mark = ASSETS["monogram-white"];
  const word = ASSETS["wordmark-white"];
  const markW = Math.round((height * mark.width) / mark.height);
  // Wordmark height ~40% of monogram (matches preferred earlier nav look)
  const wordH = Math.max(12, Math.round(height * 0.4));
  const wordW = Math.round((wordH * word.width) / word.height);
  const gap = Math.max(10, Math.round(height * 0.35));

  return (
    <span
      className={`inline-flex items-center select-none ${className ?? ""}`}
      style={{ gap }}
      role="img"
      aria-label="Founder-Being"
    >
      <Image
        src={monogramSrc}
        alt=""
        width={markW}
        height={height}
        priority={priority}
        aria-hidden
        className="h-auto w-auto"
        style={{ height, width: "auto" }}
      />
      <Image
        src={wordmarkSrc}
        alt=""
        width={wordW}
        height={wordH}
        priority={priority}
        aria-hidden
        className="h-auto w-auto"
        style={{ height: wordH, width: "auto" }}
      />
    </span>
  );
}

export function Logo({
  className = "",
  variant = "lockup-white",
  height = 44,
  priority = false,
}: LogoProps) {
  if (variant === "nav-white") {
    return (
      <NavLogo
        monogramSrc={ASSETS["monogram-white"].src}
        wordmarkSrc={ASSETS["wordmark-white"].src}
        height={height}
        priority={priority}
        className={className}
      />
    );
  }

  if (variant === "nav-gold") {
    return (
      <NavLogo
        monogramSrc={ASSETS["monogram-gold"].src}
        wordmarkSrc={ASSETS["wordmark-gold"].src}
        height={height}
        priority={priority}
        className={className}
      />
    );
  }

  const asset = ASSETS[variant];
  return (
    <SingleLogo
      src={asset.src}
      intrinsicW={asset.width}
      intrinsicH={asset.height}
      height={height}
      priority={priority}
      className={className}
      alt="Founder-Being"
    />
  );
}
