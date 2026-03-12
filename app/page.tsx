import Link from "next/link";

const commandCards = [
  {
    name: "/ping",
    description: "Confirma se o bot esta online e responde com a latencia."
  },
  {
    name: "/help",
    description: "Lista os comandos disponiveis e mostra o que cada um faz."
  },
  {
    name: "/server",
    description: "Exibe informacoes basicas do servidor onde o comando foi usado."
  }
];

const setupSteps = [
  "Defina o token do bot nas variaveis de ambiente.",
  "Registre os slash commands com o script npm run register.",
  "Suba o site no Vercel.",
  "Hospede o processo do bot em um servico Node com processo persistente."
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="hero-card">
        <p className="eyebrow">Site + Bot Discord</p>
        <h1>Estrutura completa para gerenciar o seu bot e publicar o site no Vercel.</h1>
        <p className="lead">
          O painel mostra o status da configuracao, explica onde colocar o token e entrega um bot
          funcional com slash commands prontos.
        </p>

        <div className="cta-row">
          <Link className="primary-button" href="/painel">
            Abrir painel
          </Link>
          <a
            className="secondary-button"
            href="https://vercel.com/docs"
            rel="noreferrer"
            target="_blank"
          >
            Docs Vercel
          </a>
        </div>
      </section>

      <section className="grid-section">
        <article className="info-card warning-card">
          <p className="card-label">Importante</p>
          <h2>Vercel nao mantem bot Discord online em tempo integral.</h2>
          <p>
            O site pode ficar no Vercel, mas o bot precisa rodar em um processo persistente com
            WebSocket ativo. Use Railway, Render, Fly.io, VPS ou PM2 em um servidor Node.
          </p>
        </article>

        <article className="info-card">
          <p className="card-label">Comandos incluidos</p>
          <div className="command-list">
            {commandCards.map((command) => (
              <div className="command-item" key={command.name}>
                <strong>{command.name}</strong>
                <span>{command.description}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="info-card">
          <p className="card-label">Fluxo recomendado</p>
          <ol className="steps-list">
            {setupSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>
      </section>
    </main>
  );
}
