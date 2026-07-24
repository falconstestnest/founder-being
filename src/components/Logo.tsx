type LogoProps = {
  className?: string;
  variant?: "white" | "black";
  height?: number;
};

export function Logo({
  className = "",
  variant = "white",
  height = 40,
}: LogoProps) {
  const fill = variant === "white" ? "#F8F8F8" : "#0B0B0B";
  const accent = "#FFAB33";

  return (
    <svg
      role="img"
      aria-label="Founder-Being"
      viewBox="0 0 420 64"
      height={height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Founder-Being</title>
      <text
        x="0"
        y="46"
        fill={fill}
        fontFamily="var(--font-cormorant), Georgia, serif"
        fontSize="42"
        letterSpacing="1.5"
      >
        Founder
      </text>
      <text
        x="168"
        y="46"
        fill={accent}
        fontFamily="var(--font-cormorant), Georgia, serif"
        fontSize="42"
        letterSpacing="1.5"
      >
        -
      </text>
      <text
        x="186"
        y="46"
        fill={fill}
        fontFamily="var(--font-cormorant), Georgia, serif"
        fontSize="42"
        letterSpacing="1.5"
      >
        Being
      </text>
    </svg>
  );
}
