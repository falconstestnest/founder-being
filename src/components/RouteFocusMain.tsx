"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * After client-side route changes, move focus to <main> so:
 * - keyboard users land in page content
 * - the skip link (first in DOM) does not receive focus and become visible
 *
 * Skip initial mount so first Tab still reaches the skip link first.
 */
export function RouteFocusMain() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }

    const main = document.getElementById("main-content");
    if (!main) return;

    // Ensure main can receive focus without being in the tab order permanently
    if (!main.hasAttribute("tabindex")) {
      main.setAttribute("tabindex", "-1");
    }

    main.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}
