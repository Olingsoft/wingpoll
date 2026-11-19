"use client";

import React, { useEffect, useRef } from "react";

const BANNER_CONTAINER_ID = "adsterra-banner-68e0a09bbc820de3b32c8d245eebb01f";
const BANNER_SCRIPT_SRC = "https://bauval.org/22/68e0a09bbc820de3b32c8d245eebb01f";

export function IframeBannerAd() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (scriptLoadedRef.current) return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const container = wrapper.querySelector(
      `#${BANNER_CONTAINER_ID}`
    ) as HTMLElement | null;
    if (container) {
      container.innerHTML = "";
    }

    const existingScript = wrapper.querySelector(
      `script[src="${BANNER_SCRIPT_SRC}"]`
    );
    if (existingScript) {
      existingScript.remove();
    }

    const configScript = document.createElement("script");
    configScript.textContent = `
      atOptions = {
        'key' : '68e0a09bbc820de3b32c8d245eebb01f',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
      };
    `;
    configScript.setAttribute("data-cfasync", "false");
    wrapper.appendChild(configScript);

    const adScript = document.createElement("script");
    adScript.async = true;
    adScript.setAttribute("data-cfasync", "false");
    adScript.crossOrigin = "anonymous";
    adScript.src = BANNER_SCRIPT_SRC;
    wrapper.appendChild(adScript);

    scriptLoadedRef.current = true;

    return () => {
      if (configScript.parentNode) {
        configScript.parentNode.removeChild(configScript);
      }
      if (adScript.parentNode) {
        adScript.parentNode.removeChild(adScript);
      }
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="w-full bg-white border border-slate-200 rounded-lg p-3 sm:p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center gap-2 overflow-hidden"
    >
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        Sponsored
      </span>
      <div className="w-full flex justify-center overflow-x-auto">
        <div
          id={BANNER_CONTAINER_ID}
          className="border-0 max-w-full block"
          style={{ width: 468, height: 60 }}
        />
      </div>
    </div>
  );
}

