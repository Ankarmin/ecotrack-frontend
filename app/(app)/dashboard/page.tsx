"use client";

import Link from "next/link";
import {
  Recycle,
  TreePine,
  Cloud,
  TrendingUp,
  Plus,
  ChevronRight,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { label: "CO₂ ahorrado", value: "42.6 kg", icon: Cloud, hint: "este mes", color: "text-emerald-600" },
  { label: "Árboles equiv.", value: "3.2", icon: TreePine, hint: "plantados", color: "text-green-600" },
  { label: "Reciclado", value: "18.4 kg", icon: Recycle, hint: "este mes", color: "text-teal-600" },
  { label: "Racha", value: "12 días", icon: Flame, hint: "consecutivos", color: "text-orange-500" },
];

const recent = [
  { material: "Plástico PET", weight: "1.2 kg", co2: "2.4 kg", date: "Hoy", emoji: "🥤" },
  { material: "Cartón", weight: "3.0 kg", co2: "2.7 kg", date: "Ayer", emoji: "📦" },
  { material: "Vidrio", weight: "2.5 kg", co2: "0.8 kg", date: "Hace 2 días", emoji: "🍾" },
  { material: "Aluminio", weight: "0.4 kg", co2: "3.6 kg", date: "Hace 3 días", emoji: "🥫" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6 relative">
      {/* ── Hero Banner (ImpactWidget) ── */}
      <div
        className="rounded-2xl p-6 sm:p-8 text-primary-foreground relative overflow-hidden"
        style={{
          background: "var(--gradient-hero)",
          boxShadow: "var(--shadow-eco)",
        }}
      >
        {/* Subtle pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-2 border-white/30" />
          <div className="absolute bottom-0 right-12 w-48 h-48 rounded-full border-2 border-white/20" />
        </div>

        <div className="relative z-10">
          <p className="text-sm opacity-90">Hola, María 👋</p>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1">
            Tu impacto este mes
          </h1>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-bold tracking-tight">
              42.6
            </span>
            <span className="text-lg opacity-90">kg CO₂ ahorrado</span>
          </div>
          <p className="mt-2 text-sm opacity-90">
            Equivalente a 3.2 árboles plantados 🌳
          </p>

          <div className="mt-4 flex items-center gap-2">
            <div className="h-2 flex-1 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full rounded-full bg-white/80 transition-all duration-1000"
                style={{ width: "68%" }}
              />
            </div>
            <span className="text-xs opacity-80">68% meta mensual</span>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl bg-card border border-border p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <s.icon className={cn("w-4 h-4", s.color)} />
            </div>
            <p className="text-xl sm:text-2xl font-bold mt-2 text-foreground">
              {s.value}
            </p>
            <p className="text-[11px] text-muted-foreground">{s.hint}</p>
          </div>
        ))}
      </div>

      {/* ── Recent Activity List ── */}
      <div className="rounded-2xl bg-card border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-foreground">
            Registros recientes
          </h2>
          <span className="text-xs text-muted-foreground">Últimos 7 días</span>
        </div>
        <ul className="divide-y divide-border">
          {recent.map((r, i) => (
            <li key={i} className="py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg">
                {r.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {r.material}
                </p>
                <p className="text-xs text-muted-foreground">
                  {r.weight} · {r.date}
                </p>
              </div>
              <span className="text-sm font-semibold text-primary">
                −{r.co2} CO₂
              </span>
            </li>
          ))}
        </ul>

        <Link
          href="/dashboard/recycle"
          className="mt-4 flex items-center justify-center gap-1 text-sm text-primary font-medium hover:underline"
        >
          Ver todo <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* ── Floating Action Button (FAB) — Mobile ── */}
      <Link
        href="/dashboard/recycle"
        className="lg:hidden fixed bottom-20 right-4 z-30 w-14 h-14 rounded-full flex items-center justify-center text-primary-foreground shadow-xl transition-transform active:scale-95"
        style={{
          background: "var(--gradient-primary)",
          boxShadow: "var(--shadow-eco)",
        }}
        aria-label="Nuevo reciclaje"
      >
        <Plus className="w-7 h-7" />
      </Link>

      {/* ── Desktop CTA Card ── */}
      <Link
        href="/dashboard/recycle"
        className="hidden lg:flex items-center gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-5 hover:bg-primary/10 transition-colors group"
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-primary-foreground shrink-0"
          style={{ background: "var(--gradient-primary)" }}
        >
          <Plus className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-foreground">Nuevo registro de reciclaje</p>
          <p className="text-sm text-muted-foreground">
            Registra tu siguiente reciclaje y suma puntos
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
