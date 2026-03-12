import { NextResponse } from "next/server";
import { getBotSettings, getBotStatus } from "@/lib/bot-config";

const STALE_AFTER_MS = 180_000;

export async function GET() {
  const [settings, status] = await Promise.all([getBotSettings(), getBotStatus()]);
  const updatedAtMs = status.updatedAt ? new Date(status.updatedAt).getTime() : 0;
  const online = Boolean(status.online && updatedAtMs && Date.now() - updatedAtMs < STALE_AFTER_MS);

  return NextResponse.json({
    online,
    stale: !online && Boolean(status.updatedAt),
    status,
    settings
  });
}
