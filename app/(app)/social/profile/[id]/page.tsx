"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronLeft,
  UserPlus,
  UserCheck,
  Award,
  Flame,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock user database
const usersDb: Record<
  string,
  {
    name: string;
    handle: string;
    avatar: string;
    level: string;
    co2Total: number;
    recycled: number;
    followers: number;
    following: number;
    streak: number;
    badges: { name: string; emoji: string }[];
    recentActivity: { action: string; detail: string; emoji: string; time: string }[];
  }
> = {
  luciaeco: {
    name: "Lucía Fernández",
    handle: "luciaeco",
    avatar: "LF",
    level: "Platino",
    co2Total: 142,
    recycled: 85,
    followers: 234,
    following: 56,
    streak: 14,
    badges: [
      { name: "Top 3 semanal", emoji: "🏆" },
      { name: "Racha 14 días", emoji: "🔥" },
      { name: "500 kg CO₂", emoji: "☁️" },
      { name: "Eco Influencer", emoji: "🌟" },
    ],
    recentActivity: [
      { action: "Recicló", detail: "5.0 kg Plástico PET", emoji: "🥤", time: "Hace 2 h" },
      { action: "Subió al", detail: "Top 3 del ranking", emoji: "🏆", time: "Hace 1 d" },
      { action: "Recicló", detail: "2.1 kg Cartón", emoji: "📦", time: "Hace 2 d" },
    ],
  },
  cruiz: {
    name: "Carlos Ruiz",
    handle: "cruiz",
    avatar: "CR",
    level: "Oro",
    co2Total: 98,
    recycled: 62,
    followers: 156,
    following: 43,
    streak: 9,
    badges: [
      { name: "Primer reciclaje", emoji: "🌱" },
      { name: "Racha 7 días", emoji: "🔥" },
      { name: "100 kg CO₂", emoji: "☁️" },
    ],
    recentActivity: [
      { action: "Alcanzó racha de", detail: "14 días 🔥", emoji: "🔥", time: "Hace 4 h" },
      { action: "Recicló", detail: "1.5 kg Vidrio", emoji: "🍾", time: "Hace 1 d" },
    ],
  },
};

const defaultUser = {
  name: "Usuario",
  handle: "usuario",
  avatar: "??",
  level: "Bronce",
  co2Total: 0,
  recycled: 0,
  followers: 0,
  following: 0,
  streak: 0,
  badges: [],
  recentActivity: [],
};

export default function PublicProfilePage() {
  const params = useParams();
  const id = params.id as string;
  const user = usersDb[id] || { ...defaultUser, handle: id };
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="space-y-6 lg:max-w-3xl lg:mx-auto">
      {/* Back */}
      <div className="flex items-center gap-3">
        <Link
          href="/social"
          className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-foreground">Perfil</h1>
      </div>

      {/* ── PublicProfileHeader ── */}
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
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
              {user.avatar}
            </div>
            <div className="flex-1">
              <p className="text-xl font-bold">{user.name}</p>
              <p className="text-sm opacity-90">@{user.handle}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-semibold">
                  {user.level}
                </span>
                {user.streak > 0 && (
                  <span className="flex items-center gap-1 text-xs opacity-90">
                    <Flame className="w-3 h-3" /> {user.streak} días
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 mt-5">
            <div className="text-center">
              <p className="text-lg font-bold">{user.co2Total}</p>
              <p className="text-[10px] opacity-80">kg CO₂</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{user.recycled}</p>
              <p className="text-[10px] opacity-80">kg reciclado</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{user.followers}</p>
              <p className="text-[10px] opacity-80">seguidores</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{user.following}</p>
              <p className="text-[10px] opacity-80">siguiendo</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setIsFollowing((v) => !v)}
          className={cn(
            "rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-all",
            isFollowing
              ? "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
              : "text-primary-foreground"
          )}
          style={
            !isFollowing
              ? {
                  background: "var(--gradient-primary)",
                  boxShadow: "var(--shadow-eco)",
                }
              : undefined
          }
        >
          {isFollowing ? (
            <>
              <UserCheck className="w-4 h-4" /> Siguiendo
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" /> Seguir
            </>
          )}
        </button>
        <button className="rounded-xl py-3 text-sm font-semibold bg-card border border-border text-foreground flex items-center justify-center gap-2 hover:bg-secondary/50 transition-colors">
          <Share2 className="w-4 h-4" /> Compartir
        </button>
      </div>

      {/* Badges */}
      {user.badges.length > 0 && (
        <div className="rounded-2xl bg-card border border-border p-5">
          <h2 className="font-bold text-foreground flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-primary" /> Logros
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {user.badges.map((b) => (
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
      )}

      {/* Recent Activity */}
      {user.recentActivity.length > 0 && (
        <div className="rounded-2xl bg-card border border-border p-5">
          <h2 className="font-bold text-foreground mb-3">
            Actividad reciente
          </h2>
          <ul className="space-y-3">
            {user.recentActivity.map((a, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-base shrink-0">
                  {a.emoji}
                </div>
                <div className="flex-1">
                  <p className="text-foreground">
                    {a.action}{" "}
                    <span className="font-semibold">{a.detail}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
