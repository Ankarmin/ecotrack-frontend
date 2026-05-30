"use client";

import { useEffect, useMemo, useState } from "react";
import { LogOut, Settings, Share2, Wallet, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ApiError,
  clearAccessToken,
  getAccessToken,
  getMyRecyclingRecords,
  getProfile,
  isClientRole,
  type RecyclingRecord,
  type UserProfileResponse,
} from "@/lib/api";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/15 backdrop-blur p-3 text-center">
      <p className="text-lg font-bold">{value}</p>
      <p className="text-[11px] opacity-90">{label}</p>
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [records, setRecords] = useState<RecyclingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      const token = getAccessToken();

      if (!token) {
        router.replace("/auth/login?next=%2Fprofile");
        return;
      }

      try {
        const [profileData, recordsData] = await Promise.all([
          getProfile(token),
          getMyRecyclingRecords(token),
        ]);

        if (!ignore) {
          setProfile(profileData);
          setRecords(recordsData);
        }
      } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
          clearAccessToken();
          router.replace("/auth/login?next=%2Fprofile");
          return;
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      ignore = true;
    };
  }, [router]);

  const initials = useMemo(() => {
    if (!profile) {
      return "ET";
    }

    return `${profile.user.firstNames[0] ?? ""}${profile.user.lastNames[0] ?? ""}`.toUpperCase();
  }, [profile]);

  const stats = useMemo(() => {
    const validatedRecords = records.filter((record) => record.status === "Validado");
    const totalCo2 = validatedRecords.reduce((sum, record) => sum + record.savedCo2, 0);
    const totalWeight = validatedRecords.reduce((sum, record) => sum + record.weightKg, 0);

    return {
      totalCo2,
      totalWeight,
      totalRecords: records.length,
    };
  }, [records]);

  const handleLogout = () => {
    clearAccessToken();
    router.replace("/auth/login");
  };

  const share = async () => {
    if (typeof window === "undefined" || !profile) return;

    const url = `${window.location.origin}/profile`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Perfil de ${profile.user.firstNames}`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {}
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-primary">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const isClient = isClientRole(profile.user.role);

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
              {initials}
            </div>
            <div className="flex-1">
              <p className="text-xl font-bold">
                {profile.user.firstNames} {profile.user.lastNames}
              </p>
              <p className="text-sm opacity-90">
                {profile.user.email} · {profile.user.role}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-5">
            <Stat label="CO2 total" value={`${stats.totalCo2.toFixed(1)} kg`} />
            <Stat label="Reciclado" value={`${stats.totalWeight.toFixed(1)} kg`} />
            <Stat label="Registros" value={`${stats.totalRecords}`} />
          </div>
        </div>
      </div>

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

      {isClient ? (
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
              {profile.wallet?.availablePoints ?? 0} puntos disponibles
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
      ) : null}

      <button
        onClick={handleLogout}
        className="w-full rounded-xl border border-border bg-card p-3 text-sm text-destructive font-medium flex items-center justify-center gap-2 hover:bg-destructive/5 transition-colors"
      >
        <LogOut className="w-4 h-4" /> Cerrar sesión
      </button>
    </div>
  );
}
