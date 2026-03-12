const { mkdir, readFile, writeFile } = require("node:fs/promises");
const path = require("node:path");

const dataDir = path.join(process.cwd(), "data");
const settingsPath = path.join(dataDir, "bot-settings.json");
const statusPath = path.join(dataDir, "bot-status.json");

const defaultSettings = {
  displayName: "",
  avatarUrl: "",
  description: "Painel local de gerenciamento do bot.",
  presenceStatus: "online",
  activityType: "Playing",
  activityText: "Gerenciado pelo painel web"
};

const defaultStatus = {
  online: false,
  tag: "",
  username: "",
  updatedAt: ""
};

async function ensureDataDir() {
  await mkdir(dataDir, { recursive: true });
}

async function readJsonFile(filePath, fallback) {
  await ensureDataDir();

  try {
    const content = await readFile(filePath, "utf8");
    return JSON.parse(content);
  } catch {
    await writeFile(filePath, JSON.stringify(fallback, null, 2));
    return fallback;
  }
}

async function getBotSettings() {
  return readJsonFile(settingsPath, defaultSettings);
}

async function saveBotStatus(input) {
  await ensureDataDir();
  await writeFile(statusPath, JSON.stringify(input, null, 2));
  return input;
}

module.exports = {
  getBotSettings,
  saveBotStatus
};
