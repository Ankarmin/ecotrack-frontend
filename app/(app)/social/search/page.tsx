"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronLeft, UserPlus, UserCheck, Cloud, TreePine } from "lucide-react";
import { cn } from "@/lib/utils";

type UserResult = {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  co2: number;
  level: string;
  following: boolean;
};

const allUsers: UserResult[] = [
  { id: "1", name: "Lucía Fernández", handle: "luciaeco", avatar: "LF", co2: 142, level: "Platino", following: true },
  { id: "2", name: "Carlos Ruiz", handle: "cruiz", avatar: "CR", co2: 98, level: "Oro", following: true },
  { id: "3", name: "Ana Torres", handle: "anat", avatar: "AT", co2: 76, level: "Oro", following: false },
  { id: "4", name: "Diego López", handle: "dlopez", avatar: "DL", co2: 54, level: "Plata", following: false },
  { id: "5", name: "Sofía Pérez", handle: "sofip", avatar: "SP", co2: 45, level: "Plata", following: false },
  { id: "6", name: "Javier Mora", handle: "jmora", avatar: "JM", co2: 38, level: "Bronce", following: false },
  { id: "7", name: "Elena Díaz", handle: "elenad", avatar: "ED", co2: 32, level: "Bronce", following: false },
  { id: "8", name: "Roberto Paz", handle: "rpaz", avatar: "RP", co2: 25, level: "Bronce", following: false },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState(allUsers);

  const filtered = useMemo(() => {
    if (!query.trim()) return users;
    const q = query.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.handle.toLowerCase().includes(q)
    );
  }, [query, users]);

  const toggleFollow = (id: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, following: !u.following } : u
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/social"
          className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold text-foreground">Buscar personas</h1>
      </div>

      {/* ── SearchBar ── */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          id="search-users"
          type="text"
          placeholder="Buscar por nombre o @usuario..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-input bg-card pl-11 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          autoFocus
        />
      </div>

      {/* ── UserResultList ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            No se encontraron usuarios para &ldquo;{query}&rdquo;
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((user) => (
            <div
              key={user.id}
              className="rounded-xl bg-card border border-border p-4 flex items-center gap-3"
            >
              <Link
                href={`/social/profile/${user.handle}`}
                className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0"
                style={{ background: "var(--gradient-primary)" }}
              >
                {user.avatar}
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/social/profile/${user.handle}`}
                  className="text-sm font-semibold text-foreground truncate block hover:underline"
                >
                  {user.name}
                </Link>
                <p className="text-xs text-muted-foreground">
                  @{user.handle} · {user.level}
                </p>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Cloud className="w-3 h-3" /> {user.co2} kg CO₂ total
                </p>
              </div>
              <button
                onClick={() => toggleFollow(user.id)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0",
                  user.following
                    ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    : "bg-primary text-primary-foreground hover:opacity-90"
                )}
              >
                {user.following ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5" /> Siguiendo
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" /> Seguir
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
