"use client";

import { Trophy, Medal, Award, Crown, TrendingUp, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const users = [
  { rank: 1, name: "Lucía Fernández", handle: "@luciaeco", co2: 38.4, streak: 14, avatar: "LF" },
  { rank: 2, name: "María González", handle: "@mariag", co2: 32.1, streak: 12, avatar: "MG", me: true },
  { rank: 3, name: "Carlos Ruiz", handle: "@cruiz", co2: 28.7, streak: 9, avatar: "CR" },
  { rank: 4, name: "Ana Torres", handle: "@anat", co2: 24.3, streak: 7, avatar: "AT" },
  { rank: 5, name: "Diego López", handle: "@dlopez", co2: 21.8, streak: 5, avatar: "DL" },
  { rank: 6, name: "Sofía Pérez", handle: "@sofip", co2: 19.2, streak: 6, avatar: "SP" },
  { rank: 7, name: "Javier Mora", handle: "@jmora", co2: 17.5, streak: 4, avatar: "JM" },
  { rank: 8, name: "Elena Díaz", handle: "@elenad", co2: 15.0, streak: 3, avatar: "ED" },
  { rank: 9, name: "Roberto Paz", handle: "@rpaz", co2: 12.3, streak: 2, avatar: "RP" },
  { rank: 10, name: "Carmen Vega", handle: "@cvega", co2: 10.1, streak: 1, avatar: "CV" },
];

const podiumIcon = [Crown, Medal, Award];
const podiumColors = [
  "from-amber-400 to-yellow-500",
  "from-slate-300 to-slate-400",
  "from-orange-400 to-amber-500",
];

const myUser = users.find((u) => u.me)!;

export default function GamificationPage() {
  const top3 = users.slice(0, 3);
  const rest = users.slice(3);

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" /> Ranking semanal
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Top usuarios por CO₂ ahorrado en los últimos 7 días
          </p>
        </div>
        <Link
          href="/gamification/wallet"
          className="hidden sm:flex items-center gap-2 rounded-xl bg-primary/10 text-primary px-4 py-2 text-sm font-semibold hover:bg-primary/20 transition-colors"
        >
          💰 Billetera
        </Link>
      </div>

      {/* ── TopThreePodium ── */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[1, 0, 2].map((idx) => {
          const u = top3[idx];
          const Icon = podiumIcon[u.rank - 1];
          const heights = ["h-28", "h-36", "h-24"];
          return (
            <div
              key={u.rank}
              className="flex flex-col items-center justify-end"
            >
              <div className="relative">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-primary-foreground font-bold mb-2 ring-2 ring-white shadow-lg"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {u.avatar}
                </div>
                {u.rank === 1 && (
                  <span className="absolute -top-2 -right-1 text-lg">👑</span>
                )}
              </div>
              <p className="text-xs font-semibold text-foreground truncate max-w-full">
                {u.name.split(" ")[0]}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {u.co2} kg
              </p>
              <div
                className={cn(
                  "w-full mt-2 rounded-t-xl bg-card border border-border border-b-0 flex flex-col items-center justify-center gap-1",
                  heights[[1, 0, 2].indexOf(idx)]
                )}
              >
                <Icon
                  className={cn(
                    "w-6 h-6",
                    u.rank === 1 ? "text-amber-500" : "text-muted-foreground"
                  )}
                />
                <span className="text-2xl font-bold text-foreground">
                  {u.rank}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── RankingList ── */}
      <div className="rounded-2xl bg-card border border-border overflow-hidden">
        <ul className="divide-y divide-border">
          {rest.map((u) => (
            <li
              key={u.rank}
              className={cn(
                "flex items-center gap-3 p-4 transition-colors",
                u.me && "bg-primary/5"
              )}
            >
              <span className="w-7 text-center text-sm font-bold text-muted-foreground">
                {u.rank}
              </span>
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-semibold text-primary">
                {u.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {u.name}{" "}
                  {u.me && (
                    <span className="text-[10px] text-primary font-bold">
                      (tú)
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground">
                  {u.handle} · <Flame className="inline w-3 h-3 text-orange-400" />{" "}
                  {u.streak} días
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">{u.co2} kg</p>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1 justify-end">
                  <TrendingUp className="w-3 h-3" /> CO₂
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ── UserPositionStickyBar ── */}
      <div className="fixed bottom-16 lg:bottom-4 inset-x-0 lg:left-64 z-10 px-4">
        <div
          className="max-w-6xl mx-auto rounded-2xl p-4 flex items-center gap-3 text-primary-foreground shadow-xl"
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "var(--shadow-eco)",
          }}
        >
          <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
            {myUser.rank}
          </span>
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
            {myUser.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{myUser.name}</p>
            <p className="text-xs opacity-80">
              <Flame className="inline w-3 h-3" /> {myUser.streak} días de racha
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">{myUser.co2} kg</p>
            <p className="text-[10px] opacity-80">CO₂ semanal</p>
          </div>
        </div>
      </div>
    </div>
  );
}
