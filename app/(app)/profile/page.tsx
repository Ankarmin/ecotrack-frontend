"use client";

import { Share2, Settings, LogOut, Award, Wallet, ChevronRight } from "lucide-react";
import Link from "next/link";

const badges = [
  { name: "Primer reciclaje", emoji: "🌱" },
  { name: "Racha 7 días", emoji: "🔥" },
  { name: "Top 5 semanal", emoji: "🏆" },
  { name: "100 kg CO₂", emoji: "☁️" },
];

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/15 backdrop-blur p-3 text-center">
      <p className="text-lg font-bold">{value}</p>
      <p className="text-[11px] opacity-90">{label}</p>
    </div>
  );
}

export default function ProfilePage() {
  const share = async () => {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}/u/mariag`;
    try {
      if (navigator.share)
        await navigator.share({ title: "Mi perfil EcoTrack", url });
      else await navigator.clipboard.writeText(url);
    } catch {}
  };

  return (
    <div className="space-y-6 lg:max-w-3xl lg:mx-auto">
      <div
        className="rounded-2xl p-6 text-primary-foreground relative overflow-hidden"
        style={{
          background: "var(--gradient-hero)",
          boxShadow: "var(--shadow-eco)",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-2 border-white/30" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-card text-primary flex items-center justify-center text-2xl font-bold">
              MG
            </div>
            <div className="flex-1">
              <p className="text-xl font-bold">María González</p>
              <p className="text-sm opacity-90">@mariag · Lima, Perú</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-5">
            <Stat label="CO₂ total" value="142 kg" />
            <Stat label="Reciclado" value="78 kg" />
            <Stat label="Seguidores" value="124" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={share}
          className="rounded-xl bg-card border border-border p-4 flex items-center gap-3 hover:border-primary/40 transition-colors"
        >
          <Share2 className="w-5 h-5 text-primary" />
          <span className="font-medium text-foreground">Compartir perfil</span>
        </button>
        <button className="rounded-xl bg-card border border-border p-4 flex items-center gap-3 hover:border-primary/40 transition-colors">
          <Settings className="w-5 h-5 text-primary" />
          <span className="font-medium text-foreground">Editar perfil</span>
        </button>
      </div>

      {/* Wallet shortcut */}
      <Link
        href="/gamification/wallet"
        className="flex items-center gap-3 rounded-xl bg-card border border-border p-4 hover:border-primary/40 transition-colors group"
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center text-primary-foreground"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Wallet className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-foreground">EcoPuntos</p>
          <p className="text-xs text-muted-foreground">
            1,240 puntos disponibles
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </Link>

      {/* Badges */}
      <div className="rounded-2xl bg-card border border-border p-5">
        <h2 className="font-bold text-foreground flex items-center gap-2 mb-4">
          <Award className="w-4 h-4 text-primary" /> Logros
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {badges.map((b) => (
            <div
              key={b.name}
              className="rounded-xl bg-secondary/50 p-3 text-center"
            >
              <div className="text-3xl">{b.emoji}</div>
              <p className="text-xs font-medium text-foreground mt-1">
                {b.name}
              </p>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full rounded-xl border border-border bg-card p-3 text-sm text-destructive font-medium flex items-center justify-center gap-2 hover:bg-destructive/5 transition-colors">
        <LogOut className="w-4 h-4" /> Cerrar sesión
      </button>
    </div>
  );
}
