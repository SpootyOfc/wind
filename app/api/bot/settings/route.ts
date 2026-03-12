import { NextResponse } from "next/server";
import { getBotSettings, saveBotSettings } from "@/lib/bot-config";

export async function GET() {
  const settings = await getBotSettings();
  return NextResponse.json(settings);
}

export async function POST(request: Request) {
  const payload = await request.json();
  const settings = await saveBotSettings(payload);
  return NextResponse.json(settings);
}
