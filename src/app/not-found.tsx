import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B0B0B] px-6 text-center text-fb-text">
      <Logo variant="lockup-white" height={96} priority />
      <p className="mt-12 font-mono text-xs tracking-[0.16em] uppercase text-[#FFAB33]">
        404
      </p>
      <h1 className="editorial-h mt-4 text-3xl md:text-4xl">Page not found</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-fb-body">
        This path does not exist. Return to Founder-Being.
      </p>
      <Link href="/" className="btn btn-secondary mt-10">
        Back home
      </Link>
    </div>
  );
}
