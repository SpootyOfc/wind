import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";

const dataDir = path.join(process.cwd(), "data");
const settingsPath = path.join(dataDir, "bot-settings.json");
const statusPath = path.join(dataDir, "bot-status.json");

const settingsSchema = z.object({
  displayName: z.string(),
  avatarUrl: z.string(),
  description: z.string(),
  presenceStatus: z.enum(["online", "idle", "dnd", "invisible"]),
  activityType: z.enum(["Playing", "Listening", "Watching", "Streaming", "Competing"]),
  activityText: z.string()
});

const statusSchema = z.object({
  online: z.boolean(),
  tag: z.string(),
  username: z.string(),
  updatedAt: z.string()
});

export type BotSettings = z.infer<typeof settingsSchema>;
export type BotRuntimeStatus = z.infer<typeof statusSchema>;

const defaultSettings: BotSettings = {
  displayName: "",
  avatarUrl: "",
  description: "Painel local de gerenciamento do bot.",
  presenceStatus: "online",
  activityType: "Playing",
  activityText: "Gerenciado pelo painel web"
};

const defaultStatus: BotRuntimeStatus = {
  online: false,
  tag: "",
  username: "",
  updatedAt: ""
};

async function ensureDataDir() {
  await mkdir(dataDir, { recursive: true });
}

async function readJsonFile<T>(filePath: string, fallback: T, schema: z.ZodType<T>) {
  await ensureDataDir();

  try {
    const content = await readFile(filePath, "utf8");
    return schema.parse(JSON.parse(content));
  } catch {
    await writeFile(filePath, JSON.stringify(fallback, null, 2));
    return fallback;
  }
}

export async function getBotSettings() {
  return readJsonFile(settingsPath, defaultSettings, settingsSchema);
}

export async function saveBotSettings(input: BotSettings) {
  const parsed = settingsSchema.parse(input);
  await ensureDataDir();
  await writeFile(settingsPath, JSON.stringify(parsed, null, 2));
  return parsed;
}

export async function getBotStatus() {
  return readJsonFile(statusPath, defaultStatus, statusSchema);
}

export async function saveBotStatus(input: BotRuntimeStatus) {
  const parsed = statusSchema.parse(input);
  await ensureDataDir();
  await writeFile(statusPath, JSON.stringify(parsed, null, 2));
  return parsed;
}
