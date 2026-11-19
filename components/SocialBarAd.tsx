"use client";

import React, { useEffect, useRef } from "react";

const SOCIAL_BAR_CONTAINER_ID = "adsterra-social-bar";

// TODO: Replace with your actual Adsterra Social Bar script URL from your dashboard
// Example: const SOCIAL_BAR_SCRIPT_SRC = "https://bauval.org/23/YOUR_SOCIAL_BAR_ID";
const SOCIAL_BAR_SCRIPT_SRC = process.env.NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_SCRIPT || "";

export function SocialBarAd() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (!SOCIAL_BAR_SCRIPT_SRC) {
      console.warn("Social Bar ad script URL not configured. Set NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_SCRIPT in .env");
      return;
    }

    if (scriptLoadedRef.current) return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const container = wrapper.querySelector(
      `#${SOCIAL_BAR_CONTAINER_ID}`
    ) as HTMLElement | null;
    if (container) {
      container.innerHTML = "";
    }

    const existingScript = wrapper.querySelector(
      `script[src="${SOCIAL_BAR_SCRIPT_SRC}"]`
    );
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.crossOrigin = "anonymous";
    script.src = SOCIAL_BAR_SCRIPT_SRC;
    wrapper.appendChild(script);

    scriptLoadedRef.current = true;

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  if (!SOCIAL_BAR_SCRIPT_SRC) {
    return null;
  }

  return (
    <div
      ref={wrapperRef}
      className="w-full bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 rounded">
          Sponsored
        </span>
      </div>
      <div
        id={SOCIAL_BAR_CONTAINER_ID}
        className="w-full min-h-[100px] flex items-center justify-center [&>*]:max-w-full"
      />
    </div>
  );
}
