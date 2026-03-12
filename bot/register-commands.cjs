require("dotenv/config");
const path = require("node:path");
const fs = require("node:fs");
const { REST, Routes } = require("discord.js");

const importedRoot = path.join(process.cwd(), "_imported_bot");
const commandsRoot = path.join(importedRoot, "ComandosSlash");

function readCommands(rootDir) {
  const output = [];
  const folders = fs.readdirSync(rootDir, { withFileTypes: true }).filter((entry) => entry.isDirectory());

  for (const folder of folders) {
    const folderPath = path.join(rootDir, folder.name);
    for (const file of fs.readdirSync(folderPath)) {
      if (!file.endsWith(".js")) {
        continue;
      }
      const command = require(path.join(folderPath, file));
      if (command?.name) {
        output.push(command);
      }
    }
  }

  return output;
}

async function registerCommands() {
  const token = process.env.DISCORD_BOT_TOKEN;
  const clientId = process.env.DISCORD_CLIENT_ID;
  const guildId = process.env.DISCORD_GUILD_ID;

  if (!token || !clientId) {
    throw new Error("Defina DISCORD_BOT_TOKEN e DISCORD_CLIENT_ID no .env");
  }

  const rest = new REST({ version: "10" }).setToken(token);
  const body = readCommands(commandsRoot);

  if (guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body });
    console.log(`Comandos registrados no servidor ${guildId}.`);
    return;
  }

  await rest.put(Routes.applicationCommands(clientId), { body });
  console.log("Comandos globais registrados.");
}

registerCommands().catch((error) => {
  console.error("Falha ao registrar comandos:", error);
  process.exit(1);
});
