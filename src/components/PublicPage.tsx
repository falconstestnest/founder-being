import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export function PublicPage({
  children,
  mainClassName = "",
}: {
  children: React.ReactNode;
  mainClassName?: string;
}) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-[#FFAB33] focus:px-4 focus:py-2 focus:text-[#0B0B0B]"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className={`bg-[#0B0B0B] text-fb-text ${mainClassName}`}>
        {children}
      </main>
      <Footer />
    </>
  );
}
