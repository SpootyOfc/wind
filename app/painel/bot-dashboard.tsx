"use client";

import { type FormEvent, useEffect, useState } from "react";

type BotSettings = {
  displayName: string;
  avatarUrl: string;
  description: string;
  presenceStatus: "online" | "idle" | "dnd" | "invisible";
  activityType: "Playing" | "Listening" | "Watching" | "Streaming" | "Competing";
  activityText: string;
};

type RuntimeResponse = {
  online: boolean;
  stale: boolean;
  status: {
    online: boolean;
    tag: string;
    username: string;
    updatedAt: string;
  };
  settings: BotSettings;
};

const emptySettings: BotSettings = {
  displayName: "",
  avatarUrl: "",
  description: "",
  presenceStatus: "online",
  activityType: "Playing",
  activityText: ""
};

export function BotDashboard() {
  const [settings, setSettings] = useState<BotSettings>(emptySettings);
  const [runtime, setRuntime] = useState<RuntimeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [dirty, setDirty] = useState(false);

  async function loadRuntime() {
    const response = await fetch("/api/bot/runtime", { cache: "no-store" });
    const data = (await response.json()) as RuntimeResponse;
    setRuntime(data);
    if (!dirty) {
      setSettings(data.settings);
    }
    setLoading(false);
  }

  useEffect(() => {
    void loadRuntime();
    const interval = window.setInterval(() => {
      void loadRuntime();
    }, 5000);

    return () => window.clearInterval(interval);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    const response = await fetch("/api/bot/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(settings)
    });

    if (!response.ok) {
      setMessage("Falha ao salvar as configuracoes.");
      setSaving(false);
      return;
    }

    setMessage("Configuracoes salvas. O bot aplica as mudancas em alguns segundos.");
    setSaving(false);
    setDirty(false);
    await loadRuntime();
  }

  return (
    <section className="grid-section dashboard-grid">
      <article className="info-card panel-card">
        <div className="panel-head">
          <div>
            <p className="card-label">Status em tempo real</p>
            <h2>Painel do bot</h2>
          </div>
          <span className={`live-badge ${runtime?.online ? "live-on" : "live-off"}`}>
            {runtime?.online ? "Online" : "Offline"}
          </span>
        </div>

        <div className="status-grid">
          <div className="status-block">
            <span>Conta conectada</span>
            <strong>{runtime?.status.tag || "Nenhuma"}</strong>
          </div>
          <div className="status-block">
            <span>Ultimo heartbeat</span>
            <strong>
              {runtime?.status.updatedAt
                ? new Date(runtime.status.updatedAt).toLocaleString("pt-BR")
                : "Sem dados"}
            </strong>
          </div>
          <div className="status-block">
            <span>Status Discord</span>
            <strong>{settings.presenceStatus}</strong>
          </div>
          <div className="status-block">
            <span>Atividade</span>
            <strong>{settings.activityType}</strong>
          </div>
        </div>

        <div className="profile-preview">
          <div className="avatar-frame">
            {settings.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt="Avatar do bot" className="avatar-preview" src={settings.avatarUrl} />
            ) : (
              <span>{(settings.displayName || runtime?.status.username || "B").slice(0, 1)}</span>
            )}
          </div>
          <div>
            <strong>{settings.displayName || runtime?.status.username || "Bot sem nome"}</strong>
            <p>{settings.description || "Sem descricao definida no painel."}</p>
          </div>
        </div>
      </article>

      <article className="info-card panel-card panel-form-card">
        <p className="card-label">Gerenciamento</p>
        <form className="bot-form" onSubmit={handleSubmit}>
          <label>
            Nome global do bot
            <input
              onChange={(event) => {
                setDirty(true);
                setSettings({ ...settings, displayName: event.target.value });
              }}
              placeholder="Ex.: RiseShop Manager"
              value={settings.displayName}
            />
          </label>

          <label>
            URL da foto/avatar
            <input
              onChange={(event) => {
                setDirty(true);
                setSettings({ ...settings, avatarUrl: event.target.value });
              }}
              placeholder="https://..."
              value={settings.avatarUrl}
            />
          </label>

          <label>
            Descricao exibida no painel
            <textarea
              onChange={(event) => {
                setDirty(true);
                setSettings({ ...settings, description: event.target.value });
              }}
              rows={4}
              value={settings.description}
            />
          </label>

          <label>
            Status
            <select
              onChange={(event) =>
                {
                  setDirty(true);
                  setSettings({
                    ...settings,
                    presenceStatus: event.target.value as BotSettings["presenceStatus"]
                  });
                }
              }
              value={settings.presenceStatus}
            >
              <option value="online">online</option>
              <option value="idle">idle</option>
              <option value="dnd">dnd</option>
              <option value="invisible">invisible</option>
            </select>
          </label>

          <label>
            Tipo da atividade
            <select
              onChange={(event) =>
                {
                  setDirty(true);
                  setSettings({
                    ...settings,
                    activityType: event.target.value as BotSettings["activityType"]
                  });
                }
              }
              value={settings.activityType}
            >
              <option value="Playing">Playing</option>
              <option value="Listening">Listening</option>
              <option value="Watching">Watching</option>
              <option value="Streaming">Streaming</option>
              <option value="Competing">Competing</option>
            </select>
          </label>

          <label>
            Texto da atividade
            <input
              onChange={(event) => {
                setDirty(true);
                setSettings({ ...settings, activityText: event.target.value });
              }}
              placeholder="Ex.: atendendo pedidos"
              value={settings.activityText}
            />
          </label>

          <div className="form-actions">
            <button disabled={saving || loading} type="submit">
              {saving ? "Salvando..." : "Salvar configuracoes"}
            </button>
            <button disabled={loading} onClick={() => void loadRuntime()} type="button">
              Atualizar status
            </button>
          </div>

          {message ? <p className="form-message">{message}</p> : null}
          <p className="form-note">
            O campo de descricao e interno do painel. A descricao do Discord Developer Portal nao
            pode ser alterada automaticamente via token do bot.
          </p>
        </form>
      </article>
    </section>
  );
}
