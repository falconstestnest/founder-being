import Image from "next/image";

/**
 * Founder-Being brand mark component.
 * Uses exported lockup / monogram / wordmark assets only —
 * never reconstructs monogram + wordmark in the UI.
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
  | "wordmark-black";

type LogoProps = {
  className?: string;
  variant?: LogoVariant;
  /** Display height in CSS pixels. Width scales with asset aspect ratio. */
  height?: number;
  priority?: boolean;
};

/** Intrinsic pixel sizes of files in /public/brand (web-optimized). */
const ASSETS: Record<
  LogoVariant,
  { src: string; width: number; height: number }
> = {
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
};

export function Logo({
  className = "",
  variant = "lockup-white",
  height = 44,
  priority = false,
}: LogoProps) {
  const asset = ASSETS[variant];
  const width = Math.round((height * asset.width) / asset.height);

  return (
    <Image
      src={asset.src}
      alt="Founder-Being"
      width={width}
      height={height}
      priority={priority}
      className={`h-auto w-auto select-none ${className}`}
      style={{ height, width: "auto" }}
      sizes={`${width}px`}
    />
  );
}
