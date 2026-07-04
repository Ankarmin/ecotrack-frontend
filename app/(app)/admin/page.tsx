"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Building2,
  ChevronRight,
  CircleCheckBig,
  Gift,
  Loader2,
  QrCode,
  Ticket,
  Users,
} from "lucide-react";

import {
  ApiError,
  clearAccessToken,
  getAccessToken,
  getAdminDashboard,
  type AdminDashboardResponse,
} from "@/lib/api";
import { cn } from "@/lib/utils";

function getStatusClass(status: string) {
  if (status === "Validado") {
    return "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20";
  }

  if (status === "Pendiente") {
    return "bg-amber-500/10 text-amber-600 border border-amber-500/20";
  }

  if (status === "Rechazado") {
    return "bg-destructive/10 text-destructive border border-destructive/20";
  }

  return "bg-muted text-muted-foreground border border-border";
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadDashboard = async () => {
      const token = getAccessToken();

      if (!token) {
        router.replace("/auth/login?next=%2Fadmin");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getAdminDashboard(token);

        if (!ignore) {
          setDashboard(data);
        }
      } catch (loadError) {
        if (loadError instanceof ApiError && loadError.status === 401) {
          clearAccessToken();
          router.replace("/auth/login?next=%2Fadmin");
          return;
        }

        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudo cargar el dashboard administrativo",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadDashboard();

    return () => {
      ignore = true;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-primary">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
        {error ?? "No se pudo cargar el modulo de administrador"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl p-6 sm:p-8 text-primary-foreground relative overflow-hidden"
        style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-eco)" }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-2 border-white/30" />
          <div className="absolute bottom-0 right-12 w-48 h-48 rounded-full border-2 border-white/20" />
        </div>
        <div className="relative z-10">
          <p className="text-sm opacity-90">Administrador</p>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1">Control general del sistema</h1>
          <p className="mt-3 text-sm opacity-90 max-w-2xl">
            Supervisa centros de acopio, cupones y el avance operativo del ecosistema EcoTrack.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {[
          { label: "Centros", value: dashboard.stats.totalCenters, icon: Building2 },
          { label: "Validadores", value: dashboard.stats.totalValidators, icon: Users },
          { label: "Cupones", value: dashboard.stats.totalCoupons, icon: Ticket },
          { label: "Reciclajes", value: dashboard.stats.totalRecords, icon: QrCode },
          { label: "Peso total", value: `${dashboard.stats.totalWeightKg.toFixed(1)} kg`, icon: CircleCheckBig },
        ].map((item) => (
          <div key={item.label} className="rounded-xl bg-card border border-border p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <item.icon className="w-4 h-4 text-primary" />
            </div>
            <p className="text-xl sm:text-2xl font-bold mt-2 text-foreground">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Link
          href="/admin/centers"
          className="rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-foreground">Gestión de centros de acopio</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Crea, edita, desactiva y supervisa el rendimiento de cada centro.
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link
          href="/admin/coupons"
          className="rounded-2xl border border-border bg-card p-5 hover:border-primary/30 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Gift className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-foreground">Administración de cupones</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Controla disponibilidad, vigencia, puntos y estado de cada beneficio.
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Centros destacados</h2>
            <Link href="/admin/centers" className="text-sm text-primary hover:underline">
              Ver todos
            </Link>
          </div>

          <div className="space-y-3">
            {dashboard.centers.map((center) => (
              <Link
                key={center.id}
                href={`/admin/centers/${center.id}`}
                className="block rounded-xl border border-border bg-background/80 p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-foreground">{center.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{center.address}</p>
                  </div>
                  <span className="text-xs font-medium rounded-full px-2.5 py-1 bg-primary/10 text-primary">
                    {center.operationalStatus}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div className="rounded-lg bg-card border border-border p-2">
                    <p className="text-[10px] text-muted-foreground">Pendientes</p>
                    <p className="font-bold text-foreground">{center.stats.pendingRecords}</p>
                  </div>
                  <div className="rounded-lg bg-card border border-border p-2">
                    <p className="text-[10px] text-muted-foreground">Validados</p>
                    <p className="font-bold text-primary">{center.stats.validatedRecords}</p>
                  </div>
                  <div className="rounded-lg bg-card border border-border p-2">
                    <p className="text-[10px] text-muted-foreground">Peso</p>
                    <p className="font-bold text-foreground">{center.stats.totalWeightKg.toFixed(1)} kg</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Cupones recientes</h2>
              <Link href="/admin/coupons" className="text-sm text-primary hover:underline">
                Ver todos
              </Link>
            </div>
            <div className="space-y-3">
              {dashboard.coupons.map((coupon) => (
                <Link
                  key={coupon.id}
                  href={`/admin/coupons/${coupon.id}/edit`}
                  className="block rounded-xl border border-border bg-background/80 p-4 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-foreground">{coupon.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {coupon.requiredPoints} pts • stock {coupon.stock}
                      </p>
                    </div>
                    <span className="text-xs rounded-full px-2.5 py-1 bg-primary/10 text-primary font-medium">
                      {coupon.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Actividad reciente</h2>
            <div className="space-y-3">
              {dashboard.recentRecords.map((record) => (
                <div key={record.id} className="rounded-xl border border-border bg-background/80 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-foreground">
                        {record.user?.name ?? "Usuario"} • {record.material?.name ?? "Material"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {record.recyclingCenter?.name ?? "Centro"} • {record.weightKg} kg
                      </p>
                    </div>
                    <span className={cn("text-xs rounded-full px-2.5 py-1 font-medium", getStatusClass(record.status))}>
                      {record.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
