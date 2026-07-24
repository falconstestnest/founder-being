import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import "./admin.css";

export const metadata: Metadata = {
  title: {
    default: "Founder-Being Operations",
    template: "%s · Founder-Being",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login and auth callback render without the operations chrome
  // (pathname not available in layout easily without headers — use a client
  // boundary in shell instead). Shell detects login via path.
  return <AdminShell>{children}</AdminShell>;
}
