import { BotDashboard } from "./bot-dashboard";
import { envSummary } from "@/lib/env";

export default function DashboardPage() {
  const env = envSummary();

  return (
    <main className="page-shell">
      <section className="hero-card compact-card">
        <p className="eyebrow">Painel de configuracao</p>
        <h1>Estado atual do projeto</h1>
        <p className="lead">
          Use este resumo para validar o ambiente antes de publicar o site e iniciar o bot.
        </p>
      </section>

      <section className="grid-section">
        <article className="info-card">
          <p className="card-label">Variaveis</p>
          <div className="status-list">
            <div className="status-item">
              <span>DISCORD_BOT_TOKEN</span>
              <strong className={env.token ? "ok" : "missing"}>
                {env.token ? "Configurado" : "Nao configurado"}
              </strong>
            </div>
            <div className="status-item">
              <span>DISCORD_CLIENT_ID</span>
              <strong className={env.clientId ? "ok" : "missing"}>
                {env.clientId ? "Configurado" : "Nao configurado"}
              </strong>
            </div>
            <div className="status-item">
              <span>DISCORD_GUILD_ID</span>
              <strong className={env.guildId ? "Configurado" : "Opcional"}>
                {env.guildId ? "Configurado" : "Opcional"}
              </strong>
            </div>
          </div>
        </article>
      </section>

      <BotDashboard />
    </main>
  );
}
