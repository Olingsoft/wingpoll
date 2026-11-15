"use client";

import React from "react";

const BANNER_SRC_DOC = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        overflow: hidden;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <script>
      atOptions = {
        'key' : '68e0a09bbc820de3b32c8d245eebb01f',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
      };
    </script>
    <script src="https://bauval.org/22/68e0a09bbc820de3b32c8d245eebb01f"></script>
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
          title="Sponsored Banner 468x60"
          srcDoc={BANNER_SRC_DOC}
          width={468}
          height={60}
          scrolling="no"
          frameBorder={0}
          className="border-0 max-w-full block"
        />
      </div>
    </div>
  );
}

