"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import {
  Building2,
  ChevronRight,
  CircleCheckBig,
  CircleX,
  Clock3,
  Loader2,
  MapPin,
  QrCode,
  RefreshCw,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import { CollectionCenterQrPanel } from "@/components/CollectionCenterQrPanel";
import {
  ApiError,
  clearAccessToken,
  getAccessToken,
  getProfile,
  getValidatorCenter,
  getValidatorRecyclingRecords,
  isValidatorRole,
  validateValidatorRecyclingRecordByQr,
  type RecyclingRecord,
  type UserProfileResponse,
  type ValidatorCenterSummaryResponse,
} from "@/lib/api";
import { cn } from "@/lib/utils";

const STATUS_FILTERS = [
  { label: "Todos", value: undefined },
  { label: "Pendiente", value: "Pendiente" },
  { label: "Validado", value: "Validado" },
  { label: "Rechazado", value: "Rechazado" },
] as const;

function getStatusMeta(status: string) {
  if (status === "Validado") {
    return {
      icon: CircleCheckBig,
      className:
        "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
    };
  }

  if (status === "Rechazado") {
    return {
      icon: CircleX,
      className: "bg-destructive/10 text-destructive border border-destructive/20",
    };
  }

  return {
    icon: Clock3,
    className: "bg-amber-500/10 text-amber-600 border border-amber-500/20",
  };
}

export default function CollectionCenterPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [summary, setSummary] = useState<ValidatorCenterSummaryResponse | null>(null);
  const [records, setRecords] = useState<RecyclingRecord[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deferredSearch = useDeferredValue(search.trim());

  const refreshCenterData = async (token: string) => {
    const [centerData, recordsData] = await Promise.all([
      getValidatorCenter(token),
      getValidatorRecyclingRecords(token, {
        status: statusFilter,
        search: deferredSearch || undefined,
      }),
    ]);

    setSummary(centerData);
    setRecords(recordsData.records);
  };

  useEffect(() => {
    let ignore = false;

    const loadData = async (showLoader: boolean) => {
      const token = getAccessToken();

      if (!token) {
        router.replace("/auth/login?next=%2Fcollection-center");
        return;
      }

      try {
        if (showLoader) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        setError(null);

        const [profileData, centerData, recordsData] = await Promise.all([
          getProfile(token),
          getValidatorCenter(token),
          getValidatorRecyclingRecords(token, {
            status: statusFilter,
            search: deferredSearch || undefined,
          }),
        ]);

        if (!isValidatorRole(profileData.user.role)) {
          toast.error("Este modulo solo esta disponible para validadores.");
          router.replace("/dashboard");
          return;
        }

        if (!ignore) {
          setProfile(profileData);
          setSummary(centerData);
          setRecords(recordsData.records);
        }
      } catch (loadError) {
        if (loadError instanceof ApiError && loadError.status === 401) {
          clearAccessToken();
          router.replace("/auth/login?next=%2Fcollection-center");
          return;
        }

        if (loadError instanceof ApiError && loadError.status === 403) {
          toast.error(loadError.message);
          router.replace("/dashboard");
          return;
        }

        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudo cargar el modulo del centro de acopio",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };

    void loadData(true);

    return () => {
      ignore = true;
    };
  }, [deferredSearch, router, statusFilter]);

  const pendingCount = useMemo(
    () => records.filter((record) => record.status === "Pendiente").length,
    [records],
  );

  const handleValidateByQr = async (qrCode: string) => {
    const token = getAccessToken();

    if (!token) {
      clearAccessToken();
      router.replace("/auth/login?next=%2Fcollection-center");
      return;
    }

    try {
      await validateValidatorRecyclingRecordByQr(token, {
        qrCode,
        status: "Validado",
      });
    } catch (validationError) {
      if (validationError instanceof ApiError && validationError.status === 401) {
        clearAccessToken();
        router.replace("/auth/login?next=%2Fcollection-center");
        return;
      }

      if (validationError instanceof ApiError && validationError.status === 403) {
        toast.error(validationError.message);
        router.replace("/dashboard");
        return;
      }

      throw validationError;
    }

    toast.success("Reciclaje validado correctamente.");
    setRefreshing(true);

    try {
      await refreshCenterData(token);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-primary">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!summary || !profile) {
    return null;
  }

  const firstName = profile.user.firstNames;

  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl p-6 sm:p-8 text-primary-foreground relative overflow-hidden"
        style={{
          background: "var(--gradient-hero)",
          boxShadow: "var(--shadow-eco)",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 right-5 w-28 h-28 rounded-full border-2 border-white/30" />
          <div className="absolute -bottom-6 right-12 w-40 h-40 rounded-full border-2 border-white/20" />
        </div>

        <div className="relative z-10 space-y-4">
          <div>
            <p className="text-sm opacity-90">Hola, {firstName}</p>
            <h1 className="text-2xl sm:text-3xl font-bold mt-1">Centro de Acopio</h1>
            <p className="text-sm opacity-90 mt-2 flex flex-wrap items-center gap-2">
              <Building2 className="w-4 h-4" />
              {summary.center.name}
              <span className="opacity-70">•</span>
              <MapPin className="w-4 h-4" />
              {summary.center.address}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="rounded-xl bg-white/15 backdrop-blur p-4">
              <p className="text-xs opacity-85">Pendientes</p>
              <p className="text-2xl font-bold mt-1">{summary.stats.pendingRecords}</p>
            </div>
            <div className="rounded-xl bg-white/15 backdrop-blur p-4">
              <p className="text-xs opacity-85">Validados</p>
              <p className="text-2xl font-bold mt-1">{summary.stats.validatedRecords}</p>
            </div>
            <div className="rounded-xl bg-white/15 backdrop-blur p-4">
              <p className="text-xs opacity-85">Rechazados</p>
              <p className="text-2xl font-bold mt-1">{summary.stats.rejectedRecords}</p>
            </div>
            <div className="rounded-xl bg-white/15 backdrop-blur p-4">
              <p className="text-xs opacity-85">Llegadas hoy</p>
              <p className="text-2xl font-bold mt-1">{summary.stats.todayRecords}</p>
            </div>
          </div>
        </div>
      </div>

      <CollectionCenterQrPanel onValidate={handleValidateByQr} disabled={refreshing} />

      {error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">Reciclajes del centro</h2>
            <p className="text-sm text-muted-foreground">
              {pendingCount} pendientes por revisar en esta vista.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const token = getAccessToken();

              if (!token) {
                clearAccessToken();
                router.replace("/auth/login?next=%2Fcollection-center");
                return;
              }

              setRefreshing(true);
              setError(null);

              void refreshCenterData(token)
                .catch((refreshError) => {
                  setError(
                    refreshError instanceof Error
                      ? refreshError.message
                      : "No se pudo actualizar la vista del centro",
                  );
                })
                .finally(() => {
                  setRefreshing(false);
                });
            }}
            className="self-start lg:self-auto rounded-xl border border-border px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 transition-colors flex items-center gap-2"
          >
            <RefreshCw className={cn("w-4 h-4 text-primary", refreshing ? "animate-spin" : "")} />
            Actualizar vista
          </button>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por QR, material o cliente"
              className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.label}
                type="button"
                onClick={() => setStatusFilter(filter.value)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors border",
                  statusFilter === filter.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {records.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-background/80 px-6 py-10 text-center">
            <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <QrCode className="w-7 h-7" />
            </div>
            <h3 className="mt-4 font-semibold text-foreground">No hay reciclajes para mostrar</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Ajusta los filtros o espera nuevas entregas en el centro.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => {
              const status = getStatusMeta(record.status);
              const StatusIcon = status.icon;

              return (
                <Link
                  key={record.id}
                  href={`/collection-center/${record.id}`}
                  className="block rounded-2xl border border-border bg-background/80 p-4 hover:border-primary/40 hover:shadow-sm transition-all"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium", status.className)}>
                          <StatusIcon className="w-3 h-3" />
                          {record.status}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {record.qrCode}
                        </span>
                      </div>

                      <div>
                        <h3 className="font-semibold text-foreground text-base">
                          {record.user?.name ?? "Cliente sin nombre"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {record.material?.name ?? "Material"} • {record.weightKg} kg
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span>{new Date(record.createdAt).toLocaleString()}</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>{record.earnedPoints} puntos potenciales</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>{record.savedCo2} kg CO2</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between lg:flex-col lg:items-end lg:justify-start gap-2 shrink-0">
                      <span className="text-sm font-semibold text-primary">Ver detalle</span>
                      <ChevronRight className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
