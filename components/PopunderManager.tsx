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

function markSessionPopunderShown(): void {
  try {
    const next = Math.max(
      getSessionPopunderCount() + 1,
      POPUNDER_CONFIG.maxPerSession
    );
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
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);
  }
}

export function PopunderManager() {
  useEffect(() => {
    if (!POPUNDER_CONFIG.enabled) return;
    if (getSessionPopunderCount() >= POPUNDER_CONFIG.maxPerSession) return;

    // Inject provider popunder scripts asynchronously once per session
    injectProviderScripts();

    let lastTrustedClickAt = 0;

    const cleanup = () => {
      window.removeEventListener("click", handleClick, false);
      window.removeEventListener("blur", handleWindowBlur);
    };

    // If a provider script opens a popunder tab right after a user click,
    // record the session cap so reloading/navigating won't re-inject scripts.
    const handleWindowBlur = () => {
      if (Date.now() - lastTrustedClickAt <= 1500) {
        markSessionPopunderShown();
        cleanup();
      }
    };

    const handleClick = (event: MouseEvent) => {
      if (!event.isTrusted || event.button !== 0) return;

      lastTrustedClickAt = Date.now();

      if (getSessionPopunderCount() >= POPUNDER_CONFIG.maxPerSession) {
        cleanup();
        return;
      }

      const target = event.target as HTMLElement | null;
      if (!target) return;

      // Do not interfere with buttons, links, forms, downloads, or controls
      if (target.closest(POPUNDER_CONFIG.ignoredSelectors)) {
        return;
      }

      // If a direct popunder URL is configured, open it cleanly in a new tab
      if (POPUNDER_CONFIG.directUrl) {
        markSessionPopunderShown();
        cleanup();

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

    window.addEventListener("click", handleClick, false);
    window.addEventListener("blur", handleWindowBlur);

    return cleanup;
  }, []);

  return null;
}
