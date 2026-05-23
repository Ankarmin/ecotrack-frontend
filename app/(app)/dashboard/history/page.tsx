"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, Clock, Loader2 } from "lucide-react";

import { ApiError, clearAccessToken, getAccessToken, getMyRecyclingRecords, type RecyclingRecord } from "@/lib/api";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

function formatStatus(status: string) {
  if (status === "Validado") {
    return {
      label: "Validado",
      className:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
      icon: CheckCircle2,
    };
  }

  if (status === "Rechazado") {
    return {
      label: "Rechazado",
      className:
        "bg-destructive/10 text-destructive border border-destructive/20",
      icon: Clock,
    };
  }

  return {
    label: "Pendiente",
    className:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20",
    icon: Clock,
  };
}

export default function HistoryPage() {
  const router = useRouter();
  const [records, setRecords] = useState<RecyclingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadRecords = async () => {
      const token = getAccessToken();

      if (!token) {
        router.replace("/auth/login?next=%2Fdashboard%2Fhistory");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getMyRecyclingRecords(token);

        if (!ignore) {
          setRecords(data);
        }
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          clearAccessToken();
          router.replace("/auth/login?next=%2Fdashboard%2Fhistory");
          return;
        }

        if (!ignore) {
          setError(
            err instanceof Error ? err.message : "No se pudo cargar el historial"
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadRecords();

    return () => {
      ignore = true;
    };
  }, [router]);

  const summary = useMemo(() => {
    return records.reduce(
      (accumulator, record) => {
        accumulator.weight += record.weightKg;
        if (record.status === "Validado") {
          accumulator.points += record.earnedPoints;
        }
        return accumulator;
      },
      { weight: 0, points: 0 }
    );
  }, [records]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-primary">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard"
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Historial de reciclaje</h1>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground mb-1">Total reciclado</p>
          <p className="text-xl font-bold text-foreground">
            {summary.weight.toFixed(1)} kg
          </p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground mb-1">Puntos validados</p>
          <p className="text-xl font-bold text-primary">{summary.points} pts</p>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <ul className="divide-y divide-border">
          {records.map((record) => {
            const status = formatStatus(record.status);
            const StatusIcon = status.icon;

            return (
              <li key={record.id} className="p-4 sm:p-5 hover:bg-secondary/20 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-lg">
                      ♻️
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-foreground truncate">
                          {record.material?.name ?? "Material"}
                        </h3>
                        <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium", status.className)}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                        <span>{new Date(record.createdAt).toLocaleString()}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span className="font-medium text-foreground">{record.weightKg} kg</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>{record.recyclingCenter?.name ?? "Centro"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={cn("font-bold text-sm", record.status === "Validado" ? "text-primary" : "text-muted-foreground") }>
                      +{record.earnedPoints}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">
                      -{record.savedCo2} kg CO2
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
