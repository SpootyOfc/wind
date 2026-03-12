import { z } from "zod";

const envSchema = z.object({
  DISCORD_BOT_TOKEN: z.string().min(1, "Defina DISCORD_BOT_TOKEN"),
  DISCORD_CLIENT_ID: z.string().min(1, "Defina DISCORD_CLIENT_ID"),
  DISCORD_GUILD_ID: z.string().optional()
});

export function getBotEnv() {
  return envSchema.parse(process.env);
}
