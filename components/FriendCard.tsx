"use client";

import { useState } from "react";
import { Share2, UserPlus, UserCheck, Cloud, TreePine } from "lucide-react";
import { cn } from "@/lib/utils";

export type Friend = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  co2Week: number;
  trees: number;
  following?: boolean;
};

export function FriendCard({ friend }: { friend: Friend }) {
  const [following, setFollowing] = useState(!!friend.following);

  const onShare = async () => {
    const url = `${window.location.origin}/u/${friend.handle.replace("@", "")}`;
    try {
      if (navigator.share) await navigator.share({ title: `${friend.name} en EcoTrack`, url });
      else await navigator.clipboard.writeText(url);
    } catch {}
  };

  return (
    <div className="rounded-2xl bg-card border border-border p-5 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-primary-foreground"
          style={{ background: "var(--gradient-primary)" }}
        >
          {friend.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground truncate">{friend.name}</p>
          <p className="text-xs text-muted-foreground truncate">{friend.handle}</p>
        </div>
        <button
          onClick={onShare}
          aria-label="Compartir perfil"
          className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-secondary/60 p-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground"><Cloud className="w-3 h-3" /> CO₂ semana</div>
          <p className="text-lg font-bold text-foreground mt-1">{friend.co2Week.toFixed(1)} kg</p>
        </div>
        <div className="rounded-xl bg-secondary/60 p-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground"><TreePine className="w-3 h-3" /> Árboles</div>
          <p className="text-lg font-bold text-foreground mt-1">{friend.trees.toFixed(1)}</p>
        </div>
      </div>

      <button
        onClick={() => setFollowing((v) => !v)}
        className={cn(
          "w-full rounded-xl py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2",
          following
            ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            : "bg-primary text-primary-foreground hover:opacity-90"
        )}
      >
        {following ? <><UserCheck className="w-4 h-4" /> Siguiendo</> : <><UserPlus className="w-4 h-4" /> Seguir</>}
      </button>
    </div>
  );
}