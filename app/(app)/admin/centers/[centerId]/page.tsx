"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Clock3,
  Loader2,
  MapPin,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import {
  ApiError,
  clearAccessToken,
  deactivateAdminCenter,
  getAccessToken,
  getAdminCenter,
  type AdminCenter,
} from "@/lib/api";

export default function AdminCenterDetailPage() {
  const params = useParams<{ centerId: string }>();
  const router = useRouter();
  const [center, setCenter] = useState<AdminCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadCenter = async () => {
      const token = getAccessToken();

      if (!token) {
        router.replace(`/auth/login?next=%2Fadmin%2Fcenters%2F${params.centerId}`);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getAdminCenter(token, params.centerId);

        if (!ignore) {
          setCenter(data);
        }
      } catch (loadError) {
        if (loadError instanceof ApiError && loadError.status === 401) {
          clearAccessToken();
          router.replace(`/auth/login?next=%2Fadmin%2Fcenters%2F${params.centerId}`);
          return;
        }

        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudo cargar el centro de acopio",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadCenter();

    return () => {
      ignore = true;
    };
  }, [params.centerId, router]);

  const handleDeactivate = async () => {
    if (!center) {
      return;
    }

    const token = getAccessToken();

    if (!token) {
      clearAccessToken();
      router.replace(`/auth/login?next=%2Fadmin%2Fcenters%2F${params.centerId}`);
      return;
    }

    const confirmed = window.confirm("¿Deseas desactivar este centro?");

    if (!confirmed) {
      return;
    }

    try {
      const updatedCenter = await deactivateAdminCenter(token, center.id);
      setCenter(updatedCenter);
      toast.success("Centro desactivado correctamente.");
    } catch (deactivateError) {
      setError(
        deactivateError instanceof Error
          ? deactivateError.message
          : "No se pudo desactivar el centro",
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-primary">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!center) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Link href="/admin/centers" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
          <ArrowLeft className="w-4 h-4" />
          Volver a centros
        </Link>

        <div className="flex gap-2">
          <Link
            href={`/admin/centers/${center.id}/edit#validators-asociados`}
            className="rounded-lg border border-primary/20 px-3 py-2 text-sm text-primary hover:bg-primary/5 transition-colors inline-flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Gestionar validadores
          </Link>
          <Link
            href={`/admin/centers/${center.id}/edit`}
            className="rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:border-primary/40 transition-colors inline-flex items-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            Editar
          </Link>
          {center.isActive ? (
            <button
              type="button"
              onClick={() => {
                void handleDeactivate();
              }}
              className="rounded-lg border border-destructive/30 px-3 py-2 text-sm text-destructive hover:bg-destructive/5 transition-colors inline-flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Desactivar
            </button>
          ) : null}
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div
        className="rounded-2xl p-6 text-primary-foreground"
        style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-eco)" }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              <h1 className="text-2xl font-bold">{center.name}</h1>
            </div>
            <p className="text-sm opacity-90 mt-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {center.address}
            </p>
          </div>
          <span className="rounded-full bg-white/15 px-3 py-1 text-sm font-medium">
            {center.operationalStatus}
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
          <div className="rounded-xl bg-white/15 backdrop-blur p-4">
            <p className="text-xs opacity-85">Reciclajes</p>
            <p className="text-2xl font-bold mt-1">{center.stats.totalRecords}</p>
          </div>
          <div className="rounded-xl bg-white/15 backdrop-blur p-4">
            <p className="text-xs opacity-85">Validados</p>
            <p className="text-2xl font-bold mt-1">{center.stats.validatedRecords}</p>
          </div>
          <div className="rounded-xl bg-white/15 backdrop-blur p-4">
            <p className="text-xs opacity-85">Pendientes</p>
            <p className="text-2xl font-bold mt-1">{center.stats.pendingRecords}</p>
          </div>
          <div className="rounded-xl bg-white/15 backdrop-blur p-4">
            <p className="text-xs opacity-85">Peso reciclado</p>
            <p className="text-2xl font-bold mt-1">{center.stats.totalWeightKg.toFixed(1)} kg</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Materiales reciclados</h2>
            <div className="space-y-3">
              {center.stats.materials.map((material) => (
                <div key={material.materialId} className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-foreground">{material.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {material.recordsCount} registros • {material.weightKg.toFixed(1)} kg
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-semibold text-primary">{material.validatedRecords} validados</p>
                      <p className="text-muted-foreground mt-1">{material.pendingRecords} pendientes</p>
                    </div>
                  </div>
                </div>
              ))}

              {center.stats.materials.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-background px-4 py-8 text-center text-sm text-muted-foreground">
                  Aun no hay materiales reciclados en este centro.
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <h2 className="text-lg font-bold text-foreground">Reciclajes recientes</h2>
            <div className="space-y-3">
              {center.recentRecords.map((record) => (
                <div key={record.id} className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-foreground">
                        {record.user?.name ?? "Usuario"} • {record.material?.name ?? "Material"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {record.weightKg} kg • QR {record.qrCode}
                      </p>
                    </div>
                    <span className="text-xs rounded-full px-2.5 py-1 bg-primary/10 text-primary font-medium">
                      {record.status}
                    </span>
                  </div>
                </div>
              ))}

              {center.recentRecords.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-background px-4 py-8 text-center text-sm text-muted-foreground">
                  No hay actividad reciente para este centro.
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-primary" />
              <div>
                <h2 className="text-lg font-bold text-foreground">Validadores asociados</h2>
                <p className="text-sm text-muted-foreground">
                  {center.validators.length} validador(es) vinculados a este centro.
                </p>
              </div>
            </div>
            <Link
              href={`/admin/centers/${center.id}/edit#validators-asociados`}
              className="inline-flex items-center gap-2 rounded-lg border border-primary/20 px-3 py-2 text-sm text-primary hover:bg-primary/5 transition-colors"
            >
              <Users className="w-4 h-4" />
              Editar validadores asociados
            </Link>
            <div className="space-y-3">
              {center.validators.map((validator) => (
                <div key={validator.assignmentId} className="rounded-xl border border-border bg-background p-4">
                  <p className="font-semibold text-foreground">{validator.user.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{validator.user.email}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Asignado el {new Date(validator.assignedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}

              {center.validators.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-background px-4 py-8 text-center text-sm text-muted-foreground">
                  Este centro no tiene validadores activos.
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <Clock3 className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">Horario de atencion</h2>
            </div>
            <div className="space-y-3">
              {center.schedules.map((schedule) => (
                <div key={schedule.id ?? schedule.weekday} className="rounded-xl border border-border bg-background p-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold text-foreground">{schedule.weekday}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {schedule.attends
                        ? `${schedule.openingTime?.slice(0, 5) ?? "--:--"} - ${schedule.closingTime?.slice(0, 5) ?? "--:--"}`
                        : "Sin atencion"}
                    </p>
                  </div>
                  <span className="text-xs rounded-full px-2.5 py-1 bg-primary/10 text-primary font-medium">
                    {schedule.attends ? "Atiende" : "Cerrado"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
