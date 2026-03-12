require("dotenv/config");
const { Collection, ActivityType } = require("discord.js");
const path = require("node:path");
const fs = require("node:fs");
const { getBotSettings, saveBotStatus } = require("../dist-bot-config.cjs");

const importedRoot = path.join(process.cwd(), "_imported_bot");

async function publishHeartbeat(client, online) {
  await saveBotStatus({
    online,
    tag: client.user?.tag ?? "",
    username: client.user?.username ?? "",
    updatedAt: new Date().toISOString()
  });
}

function mapPresenceType(activityType) {
  switch (activityType) {
    case "Listening":
      return "Ouvindo";
    case "Watching":
      return "Assistindo";
    case "Streaming":
      return "Transmitindo";
    case "Competing":
      return "Competindo";
    default:
      return "Jogando";
  }
}

function mapPresenceStatus(status) {
  switch (status) {
    case "idle":
      return "Ausente";
    case "dnd":
      return "Nao Perturbar";
    case "invisible":
      return "Invisivel";
    default:
      return "Online";
  }
}

async function syncDashboardSettings(client) {
  if (!client.user || !client.db?.General) {
    return;
  }

  const settings = await getBotSettings();
  client.db.General.set("ConfigGeral.StatusBot.typestatus", mapPresenceStatus(settings.presenceStatus));
  client.db.General.set(
    "ConfigGeral.StatusBot.ativistatus",
    mapPresenceType(settings.activityType)
  );
  client.db.General.set("ConfigGeral.StatusBot.textstatus", settings.activityText || "Gerenciado pelo painel web");
  client.db.General.set("ConfigGeral.StatusBot.urlstatus", "https://localhost");

  if (settings.displayName && settings.displayName !== client.user.username) {
    try {
      await client.user.setUsername(settings.displayName);
    } catch (error) {
      console.error("Falha ao atualizar o nome global do bot:", error);
    }
  }

  if (settings.avatarUrl) {
    try {
      const response = await fetch(settings.avatarUrl);
      if (response.ok) {
        const avatarBuffer = Buffer.from(await response.arrayBuffer());
        await client.user.setAvatar(avatarBuffer);
      }
    } catch (error) {
      console.error("Falha ao atualizar o avatar do bot:", error);
    }
  }

  await publishHeartbeat(client, true);
}

async function ensureLegacyChannelConfig(client) {
  if (!client.db?.General) {
    return;
  }

  const guild = client.guilds.cache.first();
  if (!guild) {
    return;
  }

  const fallbackChannel = guild.channels.cache.find(
    (channel) =>
      channel &&
      typeof channel.isTextBased === "function" &&
      channel.isTextBased() &&
      typeof channel.send === "function"
  );

  if (!fallbackChannel) {
    return;
  }

  const basePath = "ConfigGeral.ChannelsConfig";
  const channelKeys = [
    "ChannelLogAdm",
    "ChannelLogPublica",
    "ChangeChannelMod",
    "ChannelTicket",
    "ChannelAvaliar",
    "ChannelSugestao"
  ];

  for (const key of channelKeys) {
    const fullKey = `${basePath}.${key}`;
    const currentValue = client.db.General.get(fullKey);
    if (!currentValue || currentValue === "null") {
      client.db.General.set(fullKey, fallbackChannel.id);
    }
  }
}

process.env.LEGACY_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || "";
process.env.LEGACY_BOT_CLIENT_ID = process.env.DISCORD_CLIENT_ID || "";
process.env.LEGACY_BOT_OWNER_ID = process.env.DISCORD_OWNER_ID || "";
process.env.LEGACY_BOT_GUILD_ID = process.env.DISCORD_GUILD_ID || "";

fs.mkdirSync(path.join(process.cwd(), "DataBaseJson"), { recursive: true });
fs.writeFileSync(
  path.join(importedRoot, "dono.json"),
  JSON.stringify({ dono: process.env.DISCORD_OWNER_ID || "" }, null, 2)
);
fs.writeFileSync(
  path.join(importedRoot, "config.json"),
  JSON.stringify(
    {
      token: process.env.DISCORD_BOT_TOKEN || "",
      clientId: process.env.DISCORD_CLIENT_ID || ""
    },
    null,
    2
  )
);

const client = require(path.join(importedRoot, "index.js"));
client.slashCommands = client.slashCommands || new Collection();

client.once("ready", async () => {
  await ensureLegacyChannelConfig(client);
  console.log(`Colecao de slash commands carregada: ${client.slashCommands.size}`);
  await syncDashboardSettings(client);

  setInterval(() => {
    void syncDashboardSettings(client);
  }, 15_000);

  setInterval(() => {
    void publishHeartbeat(client, true);
  }, 15_000);
});

process.on("SIGINT", () => {
  void publishHeartbeat(client, false).finally(() => process.exit(0));
});

process.on("SIGTERM", () => {
  void publishHeartbeat(client, false).finally(() => process.exit(0));
});
