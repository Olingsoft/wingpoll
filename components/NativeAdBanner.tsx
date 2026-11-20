"use client";

import React from "react";

const NATIVE_AD_KEY = "74b05cb9a8071cb8f3021300c428446f";
const NATIVE_AD_SCRIPT_SRC = `https://bauval.org/21/${NATIVE_AD_KEY}`;
const NATIVE_IFRAME_HEIGHT = 320;

const nativeSrcDoc = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body { margin: 0; padding: 0; background: transparent; }
    </style>
  </head>
  <body>
    <div id="container-${NATIVE_AD_KEY}"></div>
    <script async data-cfasync="false" src="${NATIVE_AD_SCRIPT_SRC}"></script>
  </body>
</html>`;

export function NativeAdBanner() {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] overflow-hidden">
      <div className="flex items-center justify-between mb-3">
        <span className="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 rounded">
          Sponsored
        </span>
      </div>
      <iframe
        title="Sponsored native ad"
        srcDoc={nativeSrcDoc}
        width="100%"
        height={NATIVE_IFRAME_HEIGHT}
        scrolling="no"
        className="w-full border-0"
        style={{ minHeight: NATIVE_IFRAME_HEIGHT }}
        sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
      />
    </div>
  );
}
