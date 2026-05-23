"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  Recycle,
  Weight,
} from "lucide-react";

import {
  ApiError,
  clearAccessToken,
  createRecyclingRecord,
  getAccessToken,
  getMaterials,
  getRecyclingCenters,
  type Material,
  type RecyclingCenter,
} from "@/lib/api";
import { cn } from "@/lib/utils";

const steps = [
  { label: "Material", number: 1 },
  { label: "Peso", number: 2 },
  { label: "Centro", number: 3 },
];

function formatSchedule(center: RecyclingCenter) {
  const activeSchedule = center.schedules.find((schedule) => schedule.attends);

  if (!activeSchedule || !activeSchedule.openingTime || !activeSchedule.closingTime) {
    return "Horario no disponible";
  }

  return `${activeSchedule.weekday} ${activeSchedule.openingTime.slice(0, 5)}-${activeSchedule.closingTime.slice(0, 5)}`;
}

export default function RecyclePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [centers, setCenters] = useState<RecyclingCenter[]>([]);
  const [materialId, setMaterialId] = useState<string | null>(null);
  const [weight, setWeight] = useState(1);
  const [recyclingCenterId, setRecyclingCenterId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [materialsData, centersData] = await Promise.all([
          getMaterials(),
          getRecyclingCenters(),
        ]);

        if (ignore) {
          return;
        }

        setMaterials(materialsData.filter((material) => material.isActive));
        setCenters(centersData.filter((center) => center.isActive));
        setMaterialId(materialsData.find((material) => material.isActive)?.id ?? null);
        setRecyclingCenterId(
          centersData.find((center) => center.isActive)?.id ?? null
        );
      } catch (err) {
        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo cargar la configuracion de reciclaje"
          );
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
  }, []);

  const selectedMaterial = materials.find((material) => material.id === materialId) ?? null;
  const selectedCenter = centers.find((center) => center.id === recyclingCenterId) ?? null;

  const savedCo2 = useMemo(() => {
    if (!selectedMaterial) {
      return 0;
    }

    return Number((weight * selectedMaterial.co2PerKg).toFixed(2));
  }, [selectedMaterial, weight]);

  const earnedPoints = useMemo(() => {
    if (!selectedMaterial) {
      return 0;
    }

    return Math.round(weight * selectedMaterial.pointsPerKg);
  }, [selectedMaterial, weight]);

  const canNext =
    (step === 1 && Boolean(selectedMaterial)) ||
    (step === 2 && weight > 0) ||
    (step === 3 && Boolean(selectedCenter));

  const handleNext = async () => {
    if (step < 3) {
      setStep((current) => current + 1);
      return;
    }

    const token = getAccessToken();

    if (!token) {
      clearAccessToken();
      router.replace("/auth/login?next=%2Fdashboard%2Frecycle");
      return;
    }

    if (!selectedMaterial || !selectedCenter) {
      setError("Selecciona un material y un centro de reciclaje");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const response = await createRecyclingRecord(token, {
        materialId: selectedMaterial.id,
        recyclingCenterId: selectedCenter.id,
        weightKg: weight,
        qrCode: `ECO-${Date.now().toString(36).toUpperCase()}`,
      });

      router.push(
        `/dashboard/qr?recordId=${response.id}&material=${encodeURIComponent(
          response.material?.name ?? selectedMaterial.name
        )}&weight=${response.weightKg}&co2=${response.savedCo2}&location=${encodeURIComponent(
          response.recyclingCenter?.name ?? selectedCenter.name
        )}&qr=${encodeURIComponent(response.qrCode)}&status=${encodeURIComponent(response.status)}`
      );
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearAccessToken();
        router.replace("/auth/login?next=%2Fdashboard%2Frecycle");
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : "No se pudo registrar el reciclaje"
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

  return (
    <div className="space-y-6 lg:max-w-2xl lg:mx-auto">
      <div className="flex items-center gap-3">
        <button
          onClick={() => (step > 1 ? setStep((current) => current - 1) : router.back())}
          className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">
            Registrar reciclaje
          </h1>
          <p className="text-sm text-muted-foreground">
            Paso {step} de 3 - {steps[step - 1].label}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {steps.map((item) => (
          <div
            key={item.number}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              item.number <= step ? "bg-primary" : "bg-muted"
            )}
          />
        ))}
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-foreground">¿Qué vas a reciclar?</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {materials.map((material) => (
              <button
                key={material.id}
                onClick={() => setMaterialId(material.id)}
                className={cn(
                  "rounded-xl border p-4 text-left transition-all",
                  materialId === material.id
                    ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                    : "border-border bg-background hover:border-primary/40"
                )}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <Recycle className="w-5 h-5" />
                </div>
                <p className="text-sm font-semibold text-foreground">{material.name}</p>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {material.pointsPerKg} pts/kg · {material.co2PerKg} kg CO2/kg
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && selectedMaterial && (
        <div className="space-y-6">
          <div className="rounded-2xl bg-card border border-border p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Weight className="w-6 h-6" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{selectedMaterial.name}</p>
                <p className="text-xs text-muted-foreground">
                  Ajusta el peso con el slider
                </p>
              </div>
            </div>

            <div className="text-center">
              <span className="text-5xl font-bold text-foreground tabular-nums">
                {weight.toFixed(1)}
              </span>
              <span className="text-xl text-muted-foreground ml-1">kg</span>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="0.1"
                max="50"
                step="0.1"
                value={weight}
                onChange={(event) => setWeight(Number(event.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary bg-muted"
              />
            </div>
          </div>

          <div className="rounded-xl p-4 text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
            <p className="text-xs opacity-90">Impacto estimado</p>
            <p className="text-3xl font-bold mt-1">{savedCo2.toFixed(2)} kg CO2</p>
            <p className="text-xs opacity-90">{earnedPoints} puntos estimados</p>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <p className="text-sm font-semibold text-foreground">Selecciona un centro de acopio</p>
          <div className="space-y-3">
            {centers.map((center) => (
              <button
                key={center.id}
                onClick={() => setRecyclingCenterId(center.id)}
                className={cn(
                  "w-full rounded-2xl border p-4 text-left transition-all",
                  recyclingCenterId === center.id
                    ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                    : "border-border bg-card hover:border-primary/40"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{center.name}</p>
                    <p className="text-sm text-muted-foreground">{center.address}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {center.district ? `${center.district} · ` : ""}
                      {formatSchedule(center)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleNext}
        disabled={!canNext || submitting}
        className="w-full py-3.5 rounded-xl font-semibold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
        style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-eco)" }}
      >
        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
        {step < 3 ? "Continuar" : "Generar registro"}
        {!submitting ? <ChevronRight className="w-4 h-4" /> : null}
      </button>
    </div>
  );
}
