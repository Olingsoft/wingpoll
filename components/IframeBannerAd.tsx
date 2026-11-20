"use client";

import React from "react";

const BANNER_KEY = "68e0a09bbc820de3b32c8d245eebb01f";
const BANNER_WIDTH = 468;
const BANNER_HEIGHT = 60;
const BANNER_SCRIPT_SRC = `https://bauval.org/22/${BANNER_KEY}`;

const bannerSrcDoc = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body { margin: 0; padding: 0; overflow: hidden; background: transparent; }
    </style>
  </head>
  <body>
    <script data-cfasync="false" type="text/javascript">
      atOptions = {
        key: "${BANNER_KEY}",
        format: "iframe",
        height: ${BANNER_HEIGHT},
        width: ${BANNER_WIDTH},
        params: {}
      };
    </script>
    <script data-cfasync="false" type="text/javascript" src="${BANNER_SCRIPT_SRC}"></script>
  </body>
</html>`;

export function IframeBannerAd() {
  return (
    <div className="w-full bg-white border border-slate-200 rounded-lg p-3 sm:p-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center gap-2 overflow-hidden">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        Sponsored
      </span>
      <div className="w-full flex justify-center overflow-x-auto">
        <iframe
          title="Sponsored banner"
          srcDoc={bannerSrcDoc}
          width={BANNER_WIDTH}
          height={BANNER_HEIGHT}
          scrolling="no"
          className="border-0 max-w-full"
          style={{ width: BANNER_WIDTH, height: BANNER_HEIGHT }}
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
        />
      </div>
    </div>
  );
}
