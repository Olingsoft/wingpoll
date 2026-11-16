"use client";

import { useEffect } from "react";
import { POPUNDER_CONFIG } from "@/lib/popunder";

function getSessionPopunderCount(): number {
  try {
    const raw = window.sessionStorage.getItem(POPUNDER_CONFIG.storageKey);
    const parsed = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  } catch {
    // sessionStorage may be blocked in strict privacy modes
    return POPUNDER_CONFIG.maxPerSession;
  }
}

function incrementSessionPopunderCount(): void {
  try {
    const next = getSessionPopunderCount() + 1;
    window.sessionStorage.setItem(POPUNDER_CONFIG.storageKey, String(next));
  } catch {
    // Ignore storage errors in restricted environments
  }
}

function injectProviderScripts(): void {
  for (const src of POPUNDER_CONFIG.providerScripts) {
    if (!src) continue;
    if (document.querySelector(`script[src="${src}"]`)) continue;

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    document.body.appendChild(script);
  }
}

export function PopunderManager() {
  useEffect(() => {
    if (!POPUNDER_CONFIG.enabled) return;
    if (getSessionPopunderCount() >= POPUNDER_CONFIG.maxPerSession) return;

    // Load provider scripts lazily after mount only while within session cap
    const idleTimer = window.setTimeout(() => {
      if (getSessionPopunderCount() < POPUNDER_CONFIG.maxPerSession) {
        injectProviderScripts();
      }
    }, 1500);

    const handleEligibleClick = (event: MouseEvent) => {
      if (!event.isTrusted) return;
      if (event.button !== 0) return;
      if (getSessionPopunderCount() >= POPUNDER_CONFIG.maxPerSession) {
        window.removeEventListener("click", handleEligibleClick, false);
        return;
      }

      const target = event.target as HTMLElement | null;
      if (!target) return;

      // Do not interfere with buttons, links, forms, downloads, or controls
      if (target.closest(POPUNDER_CONFIG.ignoredSelectors)) {
        return;
      }

      // Cap immediately before opening to prevent duplicate tabs on rapid clicks
      incrementSessionPopunderCount();
      window.removeEventListener("click", handleEligibleClick, false);

      if (POPUNDER_CONFIG.directUrl) {
        try {
          const adTab = window.open(
            POPUNDER_CONFIG.directUrl,
            "_blank",
            "noopener,noreferrer"
          );
          if (adTab) {
            adTab.blur();
            window.focus();
          }
        } catch {
          // Respect browser popup blockers silently without redirecting
        }
      }
    };

    window.addEventListener("click", handleEligibleClick, false);

    return () => {
      window.clearTimeout(idleTimer);
      window.removeEventListener("click", handleEligibleClick, false);
    };
  }, []);

  return null;
}

