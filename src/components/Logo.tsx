import Image from "next/image";

type LogoVariant =
  | "mark-white"
  | "mark-gold"
  | "wordmark-white"
  | "wordmark-gold"
  | "lockup-white"
  | "lockup-gold";

type LogoProps = {
  className?: string;
  variant?: LogoVariant;
  /** Height of monogram mark (px). Wordmark scales with it. */
  height?: number;
  priority?: boolean;
};

const MARK = {
  "mark-white": {
    src: "/brand/monogram-white.png",
    width: 1762,
    height: 2119,
  },
  "mark-gold": {
    src: "/brand/monogram-gold.png",
    width: 1762,
    height: 2119,
  },
} as const;

const WORDMARK = {
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
} as const;

export function Logo({
  className = "",
  variant = "lockup-white",
  height = 40,
  priority = false,
}: LogoProps) {
  if (variant === "mark-white" || variant === "mark-gold") {
    const asset = MARK[variant];
    const w = Math.round((height * asset.width) / asset.height);
    return (
      <Image
        src={asset.src}
        alt="Founder-Being"
        width={w}
        height={height}
        priority={priority}
        className={`h-auto w-auto ${className}`}
        style={{ height, width: "auto" }}
      />
    );
  }

  if (variant === "wordmark-white" || variant === "wordmark-gold") {
    const asset = WORDMARK[variant];
    const w = Math.round((height * asset.width) / asset.height);
    return (
      <Image
        src={asset.src}
        alt="Founder-Being"
        width={w}
        height={height}
        priority={priority}
        className={`h-auto w-auto ${className}`}
        style={{ height, width: "auto" }}
      />
    );
  }

  const mark =
    variant === "lockup-gold" ? MARK["mark-gold"] : MARK["mark-white"];
  const word =
    variant === "lockup-gold"
      ? WORDMARK["wordmark-gold"]
      : WORDMARK["wordmark-white"];

  const markW = Math.round((height * mark.width) / mark.height);
  const wordH = Math.max(12, Math.round(height * 0.22));
  const wordW = Math.round((wordH * word.width) / word.height);

  return (
    <span
      className={`inline-flex flex-col items-center gap-[0.55em] ${className}`}
      style={{ gap: Math.max(6, Math.round(height * 0.12)) }}
      role="img"
      aria-label="Founder-Being"
    >
      <Image
        src={mark.src}
        alt=""
        width={markW}
        height={height}
        priority={priority}
        aria-hidden
        style={{ height, width: "auto" }}
      />
      <Image
        src={word.src}
        alt=""
        width={wordW}
        height={wordH}
        priority={priority}
        aria-hidden
        style={{ height: wordH, width: "auto", maxWidth: markW * 1.35 }}
      />
    </span>
  );
}
