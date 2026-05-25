"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Recycle,
  TreePine,
  Cloud,
  Plus,
  ChevronRight,
  Flame,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ApiError, clearAccessToken, getAccessToken, getMyRecyclingRecords, getProfile, type RecyclingRecord, type UserProfileResponse } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [records, setRecords] = useState<RecyclingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      const token = getAccessToken();

      if (!token) {
        router.replace("/auth/login?next=%2Fdashboard");
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
          router.replace("/auth/login?next=%2Fdashboard");
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

  const stats = useMemo(() => {
    const validatedRecords = records.filter((record) => record.status === "Validado");
    const totalCo2 = validatedRecords.reduce((sum, record) => sum + record.savedCo2, 0);
    const totalWeight = validatedRecords.reduce((sum, record) => sum + record.weightKg, 0);
    const totalDays = new Set(records.map((record) => record.createdAt.slice(0, 10))).size;

    return [
      { label: "CO2 ahorrado", value: `${totalCo2.toFixed(1)} kg`, icon: Cloud, hint: "validado", color: "text-emerald-600" },
      { label: "Arboles equiv.", value: `${(totalCo2 / 13.2).toFixed(1)}`, icon: TreePine, hint: "estimados", color: "text-green-600" },
      { label: "Reciclado", value: `${totalWeight.toFixed(1)} kg`, icon: Recycle, hint: "validado", color: "text-teal-600" },
      { label: "Registros", value: `${totalDays}`, icon: Flame, hint: "dias con actividad", color: "text-orange-500" },
    ];
  }, [records]);

  const recent = records.slice(0, 4);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-primary">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const firstName = profile?.user.firstNames ?? "Eco";
  const totalCo2 = records
    .filter((record) => record.status === "Validado")
    .reduce((sum, record) => sum + record.savedCo2, 0);

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
          <p className="text-sm opacity-90">Hola, {firstName} 👋</p>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1">
            Tu impacto este mes
          </h1>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-bold tracking-tight">
              {totalCo2.toFixed(1)}
            </span>
            <span className="text-lg opacity-90">kg CO2 ahorrado</span>
          </div>
          <p className="mt-2 text-sm opacity-90">
            Equivalente a {(totalCo2 / 13.2).toFixed(1)} arboles estimados 🌳
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
          {recent.map((record) => (
            <li key={record.id} className="py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg">
                ♻️
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {record.material?.name ?? "Material"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {record.weightKg} kg · {new Date(record.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="text-sm font-semibold text-primary">
                -{record.savedCo2} kg CO2
              </span>
            </li>
          ))}
        </ul>

        <Link
          href="/dashboard/history"
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
