import { NextResponse } from "next/server";
import { getBotStatus } from "@/lib/bot-config";
import { envSummary } from "@/lib/env";

export async function GET() {
  const botStatus = await getBotStatus();
  const updatedAtMs = botStatus.updatedAt ? new Date(botStatus.updatedAt).getTime() : 0;
  const botOnline = Boolean(
    botStatus.online && updatedAtMs && Date.now() - updatedAtMs < 45_000
  );

  return NextResponse.json({
    site: "online",
    botHostRequired: true,
    botOnline,
    environment: envSummary(),
    checkedAt: new Date().toISOString()
  });
}
