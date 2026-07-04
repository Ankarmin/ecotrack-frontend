"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CircleCheckBig,
  CircleX,
  Clock3,
  Copy,
  Loader2,
  MapPin,
  QrCode,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import {
  ApiError,
  clearAccessToken,
  getAccessToken,
  getValidatorRecyclingRecord,
  validateValidatorRecyclingRecord,
  type RecyclingRecord,
} from "@/lib/api";
import { cn } from "@/lib/utils";

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

export default function CollectionCenterRecordDetailPage() {
  const params = useParams<{ recordId: string }>();
  const router = useRouter();
  const [record, setRecord] = useState<RecyclingRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadRecord = async () => {
      const token = getAccessToken();

      if (!token) {
        router.replace(`/auth/login?next=%2Fcollection-center%2F${params.recordId}`);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getValidatorRecyclingRecord(token, params.recordId);

        if (!ignore) {
          setRecord(data);
        }
      } catch (loadError) {
        if (loadError instanceof ApiError && loadError.status === 401) {
          clearAccessToken();
          router.replace(`/auth/login?next=%2Fcollection-center%2F${params.recordId}`);
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
              : "No se pudo cargar el detalle del reciclaje",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadRecord();

    return () => {
      ignore = true;
    };
  }, [params.recordId, router]);

  const handleDecision = async (status: "Validado" | "Rechazado") => {
    const token = getAccessToken();

    if (!token) {
      clearAccessToken();
      router.replace(`/auth/login?next=%2Fcollection-center%2F${params.recordId}`);
      return;
    }

    const confirmed = window.confirm(
      status === "Validado"
        ? "¿Confirmas la llegada de este reciclaje al centro de acopio?"
        : "¿Confirmas que deseas rechazar este reciclaje?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const updatedRecord = await validateValidatorRecyclingRecord(token, params.recordId, {
        status,
      });
      setRecord(updatedRecord);
      toast.success(
        status === "Validado"
          ? "Reciclaje validado correctamente."
          : "Reciclaje rechazado correctamente.",
      );
    } catch (submitError) {
      if (submitError instanceof ApiError && submitError.status === 401) {
        clearAccessToken();
        router.replace(`/auth/login?next=%2Fcollection-center%2F${params.recordId}`);
        return;
      }

      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo actualizar el reciclaje",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-primary">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!record) {
    return null;
  }

  const status = getStatusMeta(record.status);
  const StatusIcon = status.icon;

  return (
    <div className="space-y-6 lg:max-w-3xl lg:mx-auto">
      <div className="flex items-center gap-3">
        <Link
          href="/collection-center"
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-secondary/80 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Detalle del reciclaje</h1>
          <p className="text-sm text-muted-foreground">Seguimiento y validación del ingreso</p>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div
        className="rounded-2xl p-6 text-primary-foreground relative overflow-hidden"
        style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-eco)" }}
      >
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium bg-white/15 border border-white/20", status.className)}>
              <StatusIcon className="w-3.5 h-3.5" />
              {record.status}
            </span>
            <span className="text-xs font-mono opacity-90">{record.qrCode}</span>
          </div>

          <div>
            <p className="text-2xl font-bold">{record.material?.name ?? "Material"}</p>
            <p className="text-sm opacity-90 mt-1">
              {record.weightKg} kg • {record.savedCo2} kg CO2 • {record.earnedPoints} puntos
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-white/15 backdrop-blur p-4">
              <p className="text-xs opacity-85">Cliente</p>
              <p className="font-semibold mt-1">{record.user?.name ?? "Sin nombre"}</p>
            </div>
            <div className="rounded-xl bg-white/15 backdrop-blur p-4">
              <p className="text-xs opacity-85">Registrado</p>
              <p className="font-semibold mt-1">{new Date(record.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h2 className="font-bold text-foreground">Información del reciclaje</h2>

          <div className="space-y-3 text-sm">
            <div className="flex items-start justify-between gap-4 border-b border-border pb-3">
              <span className="text-muted-foreground">Cliente</span>
              <span className="font-medium text-foreground flex items-center gap-2 text-right">
                <UserRound className="w-4 h-4 text-primary" />
                {record.user?.name ?? "Sin nombre"}
              </span>
            </div>
            <div className="flex items-start justify-between gap-4 border-b border-border pb-3">
              <span className="text-muted-foreground">Código QR</span>
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(record.qrCode);
                  toast.success("Código QR copiado.");
                }}
                className="font-mono text-foreground text-right flex items-center gap-2 hover:text-primary transition-colors"
              >
                {record.qrCode}
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-start justify-between gap-4 border-b border-border pb-3">
              <span className="text-muted-foreground">Estado actual</span>
              <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", status.className)}>
                <StatusIcon className="w-3 h-3" />
                {record.status}
              </span>
            </div>
            {record.validation ? (
              <div className="flex items-start justify-between gap-4">
                <span className="text-muted-foreground">Validado</span>
                <span className="font-medium text-foreground text-right">
                  {new Date(record.validation.validatedAt).toLocaleString()}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <h2 className="font-bold text-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Centro de acopio
          </h2>

          <div className="rounded-xl border border-border bg-background p-4">
            <p className="font-semibold text-foreground">{record.recyclingCenter?.name ?? "Centro"}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Este reciclaje fue asignado a este centro y puede validarse desde aqui.
            </p>
          </div>

          {record.status === "Pendiente" ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  void handleDecision("Validado");
                }}
                disabled={submitting}
                className="w-full rounded-xl py-3.5 font-semibold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-eco)" }}
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CircleCheckBig className="w-4 h-4" />}
                Validar reciclaje
              </button>

              <button
                type="button"
                onClick={() => {
                  void handleDecision("Rechazado");
                }}
                disabled={submitting}
                className="w-full rounded-xl border border-destructive/30 bg-destructive/5 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                <CircleX className="w-4 h-4" />
                Rechazar ingreso
              </button>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground flex items-center gap-2">
              <QrCode className="w-4 h-4 text-primary" />
              Este reciclaje ya fue procesado y no admite nuevas acciones.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
