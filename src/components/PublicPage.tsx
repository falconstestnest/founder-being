import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RouteFocusMain } from "@/components/RouteFocusMain";
import { SkipToContent } from "@/components/SkipToContent";

export function PublicPage({
  children,
  mainClassName = "",
}: {
  children: React.ReactNode;
  mainClassName?: string;
}) {
  return (
    <>
      <SkipToContent />
      <RouteFocusMain />
      <Header />
      <main
        id="main-content"
        tabIndex={-1}
        className={`bg-[#0B0B0B] text-fb-text ${mainClassName}`}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
