"use client";

import { Gift, Loader2, ShieldCheck, Ticket } from "lucide-react";
import { useState } from "react";

import type { AdminCoupon } from "@/lib/api";
import { cn } from "@/lib/utils";

export function AdminCouponForm({
  title,
  submitLabel,
  initialCoupon,
  loading = false,
  error,
  onSubmit,
}: {
  title: string;
  submitLabel: string;
  initialCoupon?: AdminCoupon | null;
  loading?: boolean;
  error?: string | null;
  onSubmit: (payload: {
    title: string;
    description?: string;
    requiredPoints: number;
    stock: number;
    validityDays: number;
    isActive: boolean;
  }) => Promise<void>;
}) {
  const [form, setForm] = useState({
    title: initialCoupon?.title ?? "",
    description: initialCoupon?.description ?? "",
    requiredPoints: initialCoupon?.requiredPoints ?? 50,
    stock: initialCoupon?.stock ?? 10,
    validityDays: initialCoupon?.validityDays ?? 30,
    isActive: initialCoupon?.isActive ?? true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setLocalError("Ingresa un titulo para el cupon.");
      return;
    }

    if (form.requiredPoints < 1 || form.stock < 0 || form.validityDays < 1) {
      setLocalError("Revisa los puntos, stock y vigencia configurados.");
      return;
    }

    try {
      setSubmitting(true);
      setLocalError(null);
      await onSubmit({
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        requiredPoints: form.requiredPoints,
        stock: form.stock,
        validityDays: form.validityDays,
        isActive: form.isActive,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 lg:max-w-3xl lg:mx-auto">
      <div
        className="rounded-2xl p-6 text-primary-foreground"
        style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-eco)" }}
      >
        <p className="text-sm opacity-90">Administración de cupones</p>
        <h1 className="text-2xl font-bold mt-1">{title}</h1>
        <p className="text-sm opacity-90 mt-2">
          Configura disponibilidad, puntos requeridos y vigencia del beneficio.
        </p>
      </div>

      {error || localError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {localError ?? error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Definicion del cupon</h2>
              <p className="text-sm text-muted-foreground">Texto y parametros principales.</p>
            </div>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Titulo</span>
            <input
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              placeholder="Descuento en tienda aliada"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-foreground">Descripcion</span>
            <textarea
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              rows={5}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary resize-none"
              placeholder="Detalla condiciones de uso, alcance y observaciones del beneficio."
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-medium text-foreground">Puntos</span>
              <input
                type="number"
                min={1}
                value={form.requiredPoints}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    requiredPoints: Number(event.target.value || 0),
                  }))
                }
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-foreground">Stock</span>
              <input
                type="number"
                min={0}
                value={form.stock}
                onChange={(event) =>
                  setForm((current) => ({ ...current, stock: Number(event.target.value || 0) }))
                }
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-foreground">Vigencia (días)</span>
              <input
                type="number"
                min={1}
                value={form.validityDays}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    validityDays: Number(event.target.value || 0),
                  }))
                }
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              />
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Condiciones de uso</h2>
                <p className="text-sm text-muted-foreground">Basadas en el modelo actual del sistema.</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background p-4 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Puntos requeridos</span>
                <span className="font-semibold text-foreground">{form.requiredPoints} pts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Disponibilidad</span>
                <span className="font-semibold text-foreground">{form.stock} unidad(es)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Vigencia</span>
                <span className="font-semibold text-foreground">{form.validityDays} días</span>
              </div>
            </div>

            <label className="rounded-xl border border-border bg-background px-4 py-3 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">Estado del cupon</p>
                <p className="text-xs text-muted-foreground">Determina si puede canjearse</p>
              </div>
              <button
                type="button"
                onClick={() => setForm((current) => ({ ...current, isActive: !current.isActive }))}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-semibold transition-colors",
                  form.isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {form.isActive ? "Activo" : "Inactivo"}
              </button>
            </label>

            <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 text-sm text-foreground flex gap-3">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p>
                En la arquitectura actual, las condiciones administrables del cupon se
                basan en puntos, stock, vigencia y estado activo.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              void handleSubmit();
            }}
            disabled={loading || submitting}
            className="w-full rounded-xl py-3.5 font-semibold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-eco)" }}
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
