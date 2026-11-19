import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export function GET() {
  const adsTxt = `google.com, pub-3984271218322436, DIRECT, f08c47fec0942fa0`;

  return new NextResponse(adsTxt, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
