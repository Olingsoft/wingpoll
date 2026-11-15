"use client";

import React, { useEffect, useRef } from "react";

const NATIVE_AD_CONTAINER_ID = "container-74b05cb9a8071cb8f3021300c428446f";
const NATIVE_AD_SCRIPT_SRC =
  "https://bauval.org/21/74b05cb9a8071cb8f3021300c428446f";

export function NativeAdBanner() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const container = wrapper.querySelector(
      `#${NATIVE_AD_CONTAINER_ID}`
    ) as HTMLElement | null;
    if (container) {
      container.innerHTML = "";
    }

    const existingScript = wrapper.querySelector(
      `script[src="${NATIVE_AD_SCRIPT_SRC}"]`
    );
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src = NATIVE_AD_SCRIPT_SRC;
    wrapper.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

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
        id={NATIVE_AD_CONTAINER_ID}
        className="w-full min-h-[120px] flex items-center justify-center [&>*]:max-w-full"
      />
    </div>
  );
}

