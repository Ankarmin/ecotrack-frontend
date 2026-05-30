"use client";

import {
  Building2,
  Clock3,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Plus,
  User,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import type { AdminCenter, AdminCenterSchedule, AdminValidatorOption } from "@/lib/api";
import { cn } from "@/lib/utils";

const WEEKDAYS = [
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
  "Domingo",
] as const;

type ScheduleDraft = {
  weekday: string;
  attends: boolean;
  openingTime: string;
  closingTime: string;
};

type CenterFormState = {
  name: string;
  address: string;
  district: string;
  isActive: boolean;
  schedules: ScheduleDraft[];
  validatorUserIds: string[];
};

type ValidatorDraft = {
  firstNames: string;
  lastNames: string;
  email: string;
  phone: string;
  password: string;
};

function buildDefaultSchedules(source?: AdminCenterSchedule[]) {
  return WEEKDAYS.map((weekday) => {
    const existing = source?.find((schedule) => schedule.weekday === weekday);

    return {
      weekday,
      attends: existing?.attends ?? false,
      openingTime: existing?.openingTime?.slice(0, 5) ?? "",
      closingTime: existing?.closingTime?.slice(0, 5) ?? "",
    };
  });
}

export function AdminCenterForm({
  title,
  submitLabel,
  validators,
  initialCenter,
  loading = false,
  error,
  onSubmit,
  onCreateValidator,
}: {
  title: string;
  submitLabel: string;
  validators: AdminValidatorOption[];
  initialCenter?: AdminCenter | null;
  loading?: boolean;
  error?: string | null;
  onSubmit: (payload: {
    name: string;
    address: string;
    district?: string;
    isActive: boolean;
    schedules: Array<{
      weekday: string;
      attends: boolean;
      openingTime?: string | null;
      closingTime?: string | null;
    }>;
    validatorUserIds: string[];
  }) => Promise<void>;
  onCreateValidator?: (payload: {
    firstNames: string;
    lastNames: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<AdminValidatorOption>;
}) {
  const [form, setForm] = useState<CenterFormState>({
    name: initialCenter?.name ?? "",
    address: initialCenter?.address ?? "",
    district: initialCenter?.district ?? "",
    isActive: initialCenter?.isActive ?? true,
    schedules: buildDefaultSchedules(initialCenter?.schedules),
    validatorUserIds:
      initialCenter?.validators.map((validator) => validator.userId) ?? [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [validatorDraft, setValidatorDraft] = useState<ValidatorDraft>({
    firstNames: "",
    lastNames: "",
    email: "",
    phone: "",
    password: "",
  });
  const [creatingValidator, setCreatingValidator] = useState(false);
  const [showValidatorPassword, setShowValidatorPassword] = useState(false);

  const selectedValidatorsLabel = useMemo(() => {
    if (form.validatorUserIds.length === 0) {
      return "Sin validadores asignados";
    }

    return `${form.validatorUserIds.length} validador(es) seleccionados`;
  }, [form.validatorUserIds.length]);

  const selectedValidators = useMemo(
    () => validators.filter((validator) => form.validatorUserIds.includes(validator.id)),
    [form.validatorUserIds, validators],
  );

  const availableValidators = useMemo(() => {
    const currentCenterId = initialCenter?.id;

    return validators.filter((validator) => {
      if (form.validatorUserIds.includes(validator.id)) {
        return true;
      }

      if (!validator.assignedCenter) {
        return true;
      }

      return Boolean(currentCenterId && validator.assignedCenter.id === currentCenterId);
    });
  }, [form.validatorUserIds, initialCenter?.id, validators]);

  const toggleValidatorSelection = (validatorId: string) => {
    setForm((current) => {
      const selected = current.validatorUserIds.includes(validatorId);

      return {
        ...current,
        validatorUserIds: selected
          ? current.validatorUserIds.filter((userId) => userId !== validatorId)
          : [...current.validatorUserIds, validatorId],
      };
    });
  };

  const handleCreateValidator = async () => {
    if (!onCreateValidator) {
      return;
    }

    if (
      !validatorDraft.firstNames.trim() ||
      !validatorDraft.lastNames.trim() ||
      !validatorDraft.email.trim() ||
      !validatorDraft.phone.trim() ||
      !validatorDraft.password.trim()
    ) {
      setLocalError("Completa todos los datos del nuevo validador.");
      return;
    }

    if (validatorDraft.password.trim().length < 8) {
      setLocalError("La contraseña del validador debe tener al menos 8 caracteres.");
      return;
    }

    try {
      setCreatingValidator(true);
      setLocalError(null);
      const createdValidator = await onCreateValidator({
        firstNames: validatorDraft.firstNames.trim(),
        lastNames: validatorDraft.lastNames.trim(),
        email: validatorDraft.email.trim(),
        phone: validatorDraft.phone.trim(),
        password: validatorDraft.password,
      });

      setValidatorDraft({
        firstNames: "",
        lastNames: "",
        email: "",
        phone: "",
        password: "",
      });
      setShowValidatorPassword(false);

      setForm((current) => ({
        ...current,
        validatorUserIds: current.validatorUserIds.includes(createdValidator.id)
          ? current.validatorUserIds
          : [...current.validatorUserIds, createdValidator.id],
      }));
    } finally {
      setCreatingValidator(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.address.trim()) {
      setLocalError("Completa el nombre y la direccion del centro.");
      return;
    }

    const invalidSchedule = form.schedules.find(
      (schedule) =>
        schedule.attends &&
        (!schedule.openingTime || !schedule.closingTime || schedule.openingTime >= schedule.closingTime),
    );

    if (invalidSchedule) {
      setLocalError(
        `Revisa el horario configurado para ${invalidSchedule.weekday}.`,
      );
      return;
    }

    try {
      setSubmitting(true);
      setLocalError(null);
      await onSubmit({
        name: form.name.trim(),
        address: form.address.trim(),
        district: form.district.trim() || undefined,
        isActive: form.isActive,
        validatorUserIds: form.validatorUserIds,
        schedules: form.schedules.map((schedule) => ({
          weekday: schedule.weekday,
          attends: schedule.attends,
          openingTime: schedule.attends ? schedule.openingTime || null : null,
          closingTime: schedule.attends ? schedule.closingTime || null : null,
        })),
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 lg:max-w-4xl lg:mx-auto">
      <div
        className="rounded-2xl p-6 text-primary-foreground"
        style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-eco)" }}
      >
        <p className="text-sm opacity-90">Administracion de centros</p>
        <h1 className="text-2xl font-bold mt-1">{title}</h1>
        <p className="text-sm opacity-90 mt-2">
          Configura datos base, horarios de atencion y validadores asociados.
        </p>
      </div>

      {error || localError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {localError ?? error}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Datos generales</h2>
                <p className="text-sm text-muted-foreground">Informacion visible del centro.</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-medium text-foreground">Nombre</span>
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                  placeholder="Centro de Acopio Norte"
                />
              </label>

              <label className="space-y-2 sm:col-span-2">
                <span className="text-sm font-medium text-foreground">Direccion</span>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    value={form.address}
                    onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                    className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                    placeholder="Av. Principal 123"
                  />
                </div>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-foreground">Distrito</span>
                <input
                  value={form.district}
                  onChange={(event) => setForm((current) => ({ ...current, district: event.target.value }))}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                  placeholder="Miraflores"
                />
              </label>

              <label className="rounded-xl border border-border bg-background px-4 py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">Estado operativo</p>
                  <p className="text-xs text-muted-foreground">Controla si el centro esta disponible</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm((current) => ({ ...current, isActive: !current.isActive }))}
                  className={cn(
                    "rounded-full px-4 py-2 text-xs font-semibold transition-colors",
                    form.isActive
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {form.isActive ? "Activo" : "Inactivo"}
                </button>
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Clock3 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Horario semanal</h2>
                <p className="text-sm text-muted-foreground">Define disponibilidad por dia.</p>
              </div>
            </div>

            <div className="space-y-3">
              {form.schedules.map((schedule, index) => (
                <div key={schedule.weekday} className="rounded-xl border border-border bg-background p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{schedule.weekday}</p>
                      <p className="text-xs text-muted-foreground">
                        {schedule.attends ? "Disponible para atencion" : "Sin atencion"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setForm((current) => ({
                          ...current,
                          schedules: current.schedules.map((item, itemIndex) =>
                            itemIndex === index
                              ? {
                                  ...item,
                                  attends: !item.attends,
                                  openingTime: !item.attends ? item.openingTime : "",
                                  closingTime: !item.attends ? item.closingTime : "",
                                }
                              : item,
                          ),
                        }))
                      }
                      className={cn(
                        "rounded-full px-4 py-2 text-xs font-semibold transition-colors self-start",
                        schedule.attends
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {schedule.attends ? "Atiende" : "Cerrado"}
                    </button>
                  </div>

                  {schedule.attends ? (
                    <div className="grid gap-3 sm:grid-cols-2 mt-4">
                      <label className="space-y-2">
                        <span className="text-xs font-medium text-muted-foreground">Apertura</span>
                        <input
                          type="time"
                          value={schedule.openingTime}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              schedules: current.schedules.map((item, itemIndex) =>
                                itemIndex === index
                                  ? { ...item, openingTime: event.target.value }
                                  : item,
                              ),
                            }))
                          }
                          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                        />
                      </label>

                      <label className="space-y-2">
                        <span className="text-xs font-medium text-muted-foreground">Cierre</span>
                        <input
                          type="time"
                          value={schedule.closingTime}
                          onChange={(event) =>
                            setForm((current) => ({
                              ...current,
                              schedules: current.schedules.map((item, itemIndex) =>
                                itemIndex === index
                                  ? { ...item, closingTime: event.target.value }
                                  : item,
                              ),
                            }))
                          }
                          className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                        />
                      </label>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div id="validators-asociados" className="rounded-2xl border border-border bg-card p-5 space-y-4 scroll-mt-24">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Validadores asociados</h2>
                <p className="text-sm text-muted-foreground">{selectedValidatorsLabel}</p>
              </div>
            </div>

            <div className="rounded-xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm text-foreground">
              Selecciona uno o varios validadores para dejarlos asociados a este centro de acopio.
            </div>

            <div className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-muted-foreground">
              Solo se muestran validadores sin centro activo o validadores que ya pertenecen a este centro.
            </div>

            {onCreateValidator ? (
              <div className="rounded-2xl border border-border bg-background p-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-foreground">Crear nuevo validador</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Usa el mismo esquema del formulario de cliente para registrar un nuevo validador y asociarlo al centro.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      value={validatorDraft.firstNames}
                      onChange={(event) =>
                        setValidatorDraft((current) => ({ ...current, firstNames: event.target.value }))
                      }
                      placeholder="Nombres"
                      className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                    />
                  </div>

                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      value={validatorDraft.lastNames}
                      onChange={(event) =>
                        setValidatorDraft((current) => ({ ...current, lastNames: event.target.value }))
                      }
                      placeholder="Apellidos"
                      className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                    />
                  </div>

                  <div className="relative sm:col-span-2">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={validatorDraft.email}
                      onChange={(event) =>
                        setValidatorDraft((current) => ({ ...current, email: event.target.value }))
                      }
                      placeholder="Correo electrónico"
                      className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      value={validatorDraft.phone}
                      onChange={(event) =>
                        setValidatorDraft((current) => ({ ...current, phone: event.target.value }))
                      }
                      placeholder="Teléfono"
                      className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-sm outline-none transition-colors focus:border-primary"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type={showValidatorPassword ? "text" : "password"}
                      value={validatorDraft.password}
                      onChange={(event) =>
                        setValidatorDraft((current) => ({ ...current, password: event.target.value }))
                      }
                      placeholder="Contraseña"
                      className="w-full rounded-xl border border-border bg-card pl-4 pr-12 py-3 text-sm outline-none transition-colors focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowValidatorPassword((current) => !current)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                      aria-label={showValidatorPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showValidatorPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    void handleCreateValidator();
                  }}
                  disabled={creatingValidator}
                  className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors inline-flex items-center gap-2 disabled:opacity-70"
                >
                  {creatingValidator ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Crear y asociar validador
                </button>
              </div>
            ) : null}

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <p className="text-sm font-medium text-foreground">Seleccionados actualmente</p>
                <span className="text-xs text-muted-foreground">{selectedValidatorsLabel}</span>
              </div>

              {selectedValidators.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedValidators.map((validator) => (
                    <button
                      key={validator.id}
                      type="button"
                      onClick={() => toggleValidatorSelection(validator.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-sm text-primary hover:bg-primary/15 transition-colors"
                    >
                      <span>{validator.name}</span>
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-background px-4 py-5 text-sm text-muted-foreground text-center">
                  Todavia no hay validadores vinculados a este centro.
                </div>
              )}
            </div>

            <div className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
              {availableValidators.map((validator) => {
                const checked = form.validatorUserIds.includes(validator.id);

                return (
                  <div
                    key={validator.id}
                    className={cn(
                      "flex items-start justify-between gap-4 rounded-xl border p-4 transition-colors",
                      checked
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:border-primary/30",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-foreground">{validator.name}</p>
                      <p className="text-xs text-muted-foreground">{validator.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {validator.assignedCenter
                          ? `Asignado a ${validator.assignedCenter.name}`
                          : "Sin centro activo"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleValidatorSelection(validator.id)}
                      className={cn(
                        "shrink-0 rounded-lg px-3 py-2 text-sm font-medium transition-colors inline-flex items-center gap-2",
                        checked
                          ? "border border-destructive/30 text-destructive hover:bg-destructive/5"
                          : "border border-primary/20 text-primary hover:bg-primary/5",
                      )}
                    >
                      {checked ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      {checked ? "Quitar" : "Agregar"}
                    </button>
                  </div>
                );
              })}

              {availableValidators.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-background px-4 py-8 text-center text-sm text-muted-foreground">
                  No hay validadores disponibles para asociar a este centro.
                </div>
              ) : null}
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
