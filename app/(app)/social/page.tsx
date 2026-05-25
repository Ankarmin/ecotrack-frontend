"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  MessageCircle,
  Share2,
  Search,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

type FeedItem = {
  id: string;
  userName: string;
  userHandle: string;
  avatar: string;
  action: string;
  detail: string;
  emoji: string;
  time: string;
  likes: number;
  liked: boolean;
};

const feedData: FeedItem[] = [
  {
    id: "1",
    userName: "Lucía Fernández",
    userHandle: "luciaeco",
    avatar: "LF",
    action: "registró un reciclaje",
    detail: "5.0 kg de Plástico PET",
    emoji: "🥤",
    time: "Hace 2 h",
    likes: 12,
    liked: false,
  },
  {
    id: "2",
    userName: "Carlos Ruiz",
    userHandle: "cruiz",
    avatar: "CR",
    action: "alcanzó una nueva racha",
    detail: "14 días consecutivos 🔥",
    emoji: "🔥",
    time: "Hace 4 h",
    likes: 28,
    liked: true,
  },
  {
    id: "3",
    userName: "Ana Torres",
    userHandle: "anat",
    avatar: "AT",
    action: "subió en el ranking",
    detail: "Ahora es #5 en el ranking semanal",
    emoji: "🏆",
    time: "Hace 1 d",
    likes: 8,
    liked: false,
  },
  {
    id: "4",
    userName: "Diego López",
    userHandle: "dlopez",
    avatar: "DL",
    action: "canjeó una recompensa",
    detail: "15% dcto. en Supermercados Wong",
    emoji: "🎁",
    time: "Hace 1 d",
    likes: 5,
    liked: false,
  },
  {
    id: "5",
    userName: "Sofía Pérez",
    userHandle: "sofip",
    avatar: "SP",
    action: "registró un reciclaje",
    detail: "2.3 kg de Vidrio",
    emoji: "🍾",
    time: "Hace 2 d",
    likes: 15,
    liked: false,
  },
];

export default function SocialFeedPage() {
  const [feed, setFeed] = useState(feedData);

  const toggleLike = (id: string) => {
    setFeed((items) =>
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              liked: !item.liked,
              likes: item.liked ? item.likes - 1 : item.likes + 1,
            }
          : item
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Comunidad
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Mira lo que hacen tus amigos por el planeta
          </p>
        </div>
        <Link
          href="/social/search"
          className="p-2.5 rounded-xl bg-card border border-border hover:border-primary/30 transition-colors"
          aria-label="Buscar usuarios"
        >
          <Search className="w-5 h-5 text-muted-foreground" />
        </Link>
      </div>

      {/* Feed */}
      {feed.length === 0 ? (
        /* ── EmptyState ── */
        <div className="rounded-2xl bg-card border border-border p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-bold text-foreground">
            Tu feed está vacío
          </h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
            Sigue a otros usuarios para ver sus logros de reciclaje aquí.
          </p>
          <Link
            href="/social/search"
            className="mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 font-semibold text-sm text-primary-foreground transition-transform active:scale-[0.98]"
            style={{
              background: "var(--gradient-primary)",
            }}
          >
            <Search className="w-4 h-4" /> Buscar personas
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {feed.map((item) => (
            /* ── FeedCard ── */
            <div
              key={item.id}
              className="rounded-2xl bg-card border border-border p-5 space-y-3"
            >
              {/* User row */}
              <div className="flex items-center gap-3">
                <Link
                  href={`/social/profile/${item.userHandle}`}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  {item.avatar}
                </Link>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">
                    <Link
                      href={`/social/profile/${item.userHandle}`}
                      className="font-semibold hover:underline"
                    >
                      {item.userName}
                    </Link>{" "}
                    <span className="text-muted-foreground">
                      {item.action}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>

              {/* Content */}
              <div className="rounded-xl bg-secondary/40 p-4 flex items-center gap-3">
                <span className="text-2xl">{item.emoji}</span>
                <p className="text-sm font-medium text-foreground">
                  {item.detail}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleLike(item.id)}
                  className={cn(
                    "flex items-center gap-1.5 text-sm transition-colors",
                    item.liked
                      ? "text-red-500"
                      : "text-muted-foreground hover:text-red-500"
                  )}
                >
                  <Heart
                    className={cn("w-4 h-4", item.liked && "fill-current")}
                  />
                  <span className="tabular-nums">{item.likes}</span>
                </button>
                <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  Comentar
                </button>
                <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors ml-auto">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
