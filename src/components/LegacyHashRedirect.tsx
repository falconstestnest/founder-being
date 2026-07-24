"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { legacyHashRoutes } from "@/lib/site";

/**
 * Migrates bookmarked / shared homepage hashes (#events, #about, …)
 * to clean routes. Hashes are not sent to the server.
 */
export function LegacyHashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const dest = legacyHashRoutes[hash] ?? legacyHashRoutes[hash.toLowerCase()];
    if (dest) {
      router.replace(dest);
    }
  }, [router]);

  return null;
}
