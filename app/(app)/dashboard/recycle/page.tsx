"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Recycle,
  Check,
  ChevronLeft,
  ChevronRight,
  MapPin,
  X,
  Weight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Data ── */
const materials = [
  { id: "plastic", label: "Plástico", emoji: "🥤", factor: 2.0 },
  { id: "paper", label: "Papel/Cartón", emoji: "📦", factor: 0.9 },
  { id: "glass", label: "Vidrio", emoji: "🍾", factor: 0.3 },
  { id: "metal", label: "Aluminio", emoji: "🥫", factor: 9.0 },
  { id: "organic", label: "Orgánico", emoji: "🍎", factor: 0.5 },
  { id: "ewaste", label: "Electrónico", emoji: "🔌", factor: 1.5 },
];

const locations = [
  {
    id: "1",
    name: "EcoTrack Centro",
    address: "Av. Larco 345, Miraflores",
    hours: "Lun-Sáb 8:00–18:00",
    distance: "1.2 km",
  },
  {
    id: "2",
    name: "EcoTrack San Isidro",
    address: "Calle Las Begonias 120",
    hours: "Lun-Vie 9:00–17:00",
    distance: "2.8 km",
  },
  {
    id: "3",
    name: "EcoTrack Surco",
    address: "Av. Primavera 890",
    hours: "Lun-Dom 7:00–19:00",
    distance: "4.1 km",
  },
];

const steps = [
  { label: "Material", number: 1 },
  { label: "Peso", number: 2 },
  { label: "Centro", number: 3 },
];

export default function RecyclePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [material, setMaterial] = useState("plastic");
  const [weight, setWeight] = useState(1.0);
  const [locationId, setLocationId] = useState("1");
  const [sheetOpen, setSheetOpen] = useState(false);

  const selectedMaterial = materials.find((m) => m.id === material)!;
  const co2 = useMemo(
    () => (weight * selectedMaterial.factor).toFixed(2),
    [weight, selectedMaterial]
  );

  const canNext = useCallback(() => {
    if (step === 1) return !!material;
    if (step === 2) return weight > 0;
    if (step === 3) return !!locationId;
    return false;
  }, [step, material, weight, locationId]);

  const next = () => {
    if (step < 3) setStep((s) => s + 1);
    else {
      // Generate QR
      router.push(
        `/dashboard/qr?material=${material}&weight=${weight}&co2=${co2}&location=${locationId}`
      );
    }
  };

  return (
    <div className="space-y-6 lg:max-w-2xl lg:mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => (step > 1 ? setStep((s) => s - 1) : router.back())}
          className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Registrar reciclaje
          </h1>
          <p className="text-sm text-muted-foreground">
            Paso {step} de 3 — {steps[step - 1].label}
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex gap-2">
        {steps.map((s) => (
          <div
            key={s.number}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              s.number <= step ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>

      {/* ── Step 1: Material ── */}
      {step === 1 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
          <p className="text-sm font-semibold text-foreground">
            ¿Qué vas a reciclar?
          </p>

          {/* Mobile: tap to open bottom sheet */}
          <button
            onClick={() => setSheetOpen(true)}
            className="lg:hidden w-full rounded-xl border border-border bg-card p-4 flex items-center gap-3 text-left"
          >
            <span className="text-3xl">{selectedMaterial.emoji}</span>
            <div className="flex-1">
              <p className="font-semibold text-foreground">
                {selectedMaterial.label}
              </p>
              <p className="text-xs text-muted-foreground">
                Factor: {selectedMaterial.factor} kg CO₂/kg
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Desktop: grid selector */}
          <div className="hidden lg:grid grid-cols-3 gap-3">
            {materials.map((m) => (
              <button
                key={m.id}
                onClick={() => setMaterial(m.id)}
                className={cn(
                  "rounded-xl border p-4 text-center transition-all",
                  material === m.id
                    ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                    : "border-border bg-background hover:border-primary/40"
                )}
              >
                <div className="text-3xl">{m.emoji}</div>
                <div className="text-sm font-medium mt-1 text-foreground">
                  {m.label}
                </div>
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {m.factor} kg CO₂/kg
                </div>
              </button>
            ))}
          </div>

          {/* ── Material Selector Bottom Sheet (Mobile) ── */}
          {sheetOpen && (
            <div
              className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end"
              onClick={() => setSheetOpen(false)}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 animate-in fade-in duration-200" />

              {/* Sheet */}
              <div
                className="relative bg-card rounded-t-3xl p-6 pt-4 space-y-4 animate-in slide-in-from-bottom duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Handle */}
                <div className="w-12 h-1.5 rounded-full bg-muted mx-auto" />

                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground">Tipo de material</h3>
                  <button
                    onClick={() => setSheetOpen(false)}
                    className="p-1 rounded-lg hover:bg-secondary text-muted-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {materials.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setMaterial(m.id);
                        setSheetOpen(false);
                      }}
                      className={cn(
                        "rounded-xl border p-3 text-center transition-all",
                        material === m.id
                          ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                          : "border-border bg-background hover:border-primary/40"
                      )}
                    >
                      <div className="text-2xl">{m.emoji}</div>
                      <div className="text-[11px] font-medium mt-1 text-foreground">
                        {m.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Step 2: Weight ── */}
      {step === 2 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="rounded-2xl bg-card border border-border p-6 space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedMaterial.emoji}</span>
              <div>
                <p className="font-semibold text-foreground">
                  {selectedMaterial.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  Ajusta el peso con el slider
                </p>
              </div>
            </div>

            {/* Weight display */}
            <div className="text-center">
              <span className="text-5xl font-bold text-foreground tabular-nums">
                {weight.toFixed(1)}
              </span>
              <span className="text-xl text-muted-foreground ml-1">kg</span>
            </div>

            {/* Slider */}
            <div className="space-y-2">
              <input
                type="range"
                min="0.1"
                max="50"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary bg-muted"
                style={{
                  background: `linear-gradient(to right, var(--primary) ${(weight / 50) * 100}%, var(--muted) ${(weight / 50) * 100}%)`,
                }}
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0.1 kg</span>
                <span>50 kg</span>
              </div>
            </div>

            {/* Quick presets */}
            <div className="flex flex-wrap gap-2">
              {[0.5, 1, 2, 5, 10].map((v) => (
                <button
                  key={v}
                  onClick={() => setWeight(v)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                    weight === v
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {v} kg
                </button>
              ))}
            </div>
          </div>

          {/* Impact preview */}
          <div
            className="rounded-xl p-4 text-primary-foreground"
            style={{ background: "var(--gradient-primary)" }}
          >
            <p className="text-xs opacity-90">Impacto estimado</p>
            <p className="text-3xl font-bold mt-1">{co2} kg CO₂</p>
            <p className="text-xs opacity-90">ahorrado al planeta</p>
          </div>
        </div>
      )}

      {/* ── Step 3: Location ── */}
      {step === 3 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
          <p className="text-sm font-semibold text-foreground">
            Selecciona un centro de acopio
          </p>

          {/* Map placeholder */}
          <div className="rounded-2xl bg-card border border-border overflow-hidden">
            <div className="h-40 bg-secondary/50 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Mapa de centros cercanos
                </p>
              </div>
            </div>
          </div>

          {/* Location list */}
          <div className="space-y-3">
            {locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setLocationId(loc.id)}
                className={cn(
                  "w-full rounded-xl border p-4 text-left transition-all",
                  locationId === loc.id
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border bg-card hover:border-primary/40"
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{loc.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {loc.address}
                    </p>
                    <p className="text-xs text-muted-foreground">{loc.hours}</p>
                  </div>
                  <span className="text-xs font-medium text-primary shrink-0">
                    {loc.distance}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Summary + Action */}
      <div className="flex items-center gap-3 pt-2">
        {step > 1 && (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="flex-1 py-3.5 rounded-xl border border-border bg-card font-semibold text-foreground hover:bg-secondary/50 transition-colors"
          >
            Atrás
          </button>
        )}
        <button
          onClick={next}
          disabled={!canNext()}
          className="flex-1 py-3.5 rounded-xl font-semibold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-50"
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "var(--shadow-eco)",
          }}
        >
          {step === 3 ? (
            <>
              <Recycle className="inline w-5 h-5 mr-2" />
              Generar QR
            </>
          ) : (
            "Siguiente"
          )}
        </button>
      </div>
    </div>
  );
}
