export function envSummary() {
  return {
    token: Boolean(process.env.DISCORD_BOT_TOKEN),
    clientId: Boolean(process.env.DISCORD_CLIENT_ID),
    guildId: Boolean(process.env.DISCORD_GUILD_ID)
  };
}
