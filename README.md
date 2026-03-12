# RiseShop Discord Manager

Projeto completo com:

- site em Next.js pronto para deploy no Vercel
- bot Discord em `discord.js`
- slash commands basicos ja configurados
- painel para conferir as variaveis de ambiente

## Ponto importante

O site pode ser hospedado no Vercel, mas o bot Discord **nao pode** ficar online 24h no Vercel porque ele precisa de um processo persistente conectado ao Gateway do Discord. A arquitetura correta e:

- frontend/painel: Vercel
- bot: Railway, Render, Fly.io, VPS ou outro host Node persistente

## Variaveis de ambiente

Copie `.env.example` para `.env` e preencha:

```env
NEXT_PUBLIC_SITE_NAME=RiseShop Discord Manager
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DISCORD_BOT_TOKEN=seu_token
DISCORD_CLIENT_ID=seu_client_id
DISCORD_GUILD_ID=seu_servidor_para_testes
```

## Como rodar localmente

```bash
npm install
npm run register
npm run dev
```

Em outro terminal, para iniciar o bot:

```bash
npm run bot
```

## Deploy do site no Vercel

1. Suba o projeto para GitHub.
2. Importe o repositorio no Vercel.
3. Em `Project Settings > Environment Variables`, cadastre:
   - `DISCORD_BOT_TOKEN`
   - `DISCORD_CLIENT_ID`
   - `DISCORD_GUILD_ID` (opcional)
   - `NEXT_PUBLIC_SITE_NAME`
   - `NEXT_PUBLIC_SITE_URL`
4. Faça o deploy.

## Deploy do bot

Use o mesmo repositorio em um host Node persistente.

- Start command: `npm run bot`
- Build command: `npm install`

Se quiser registrar os comandos automaticamente no host do bot, execute antes:

```bash
npm run register
```
