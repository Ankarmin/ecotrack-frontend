"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import {
  QrCode,
  MapPin,
  Clock,
  X,
  Check,
  Download,
} from "lucide-react";

const materials: Record<string, { label: string; emoji: string }> = {
  plastic: { label: "Plástico", emoji: "🥤" },
  paper: { label: "Papel/Cartón", emoji: "📦" },
  glass: { label: "Vidrio", emoji: "🍾" },
  metal: { label: "Aluminio", emoji: "🥫" },
  organic: { label: "Orgánico", emoji: "🍎" },
  ewaste: { label: "Electrónico", emoji: "🔌" },
};

const locationData: Record<string, { name: string; address: string; hours: string }> = {
  "1": { name: "EcoTrack Centro", address: "Av. Larco 345, Miraflores", hours: "Lun-Sáb 8:00–18:00" },
  "2": { name: "EcoTrack San Isidro", address: "Calle Las Begonias 120", hours: "Lun-Vie 9:00–17:00" },
  "3": { name: "EcoTrack Surco", address: "Av. Primavera 890", hours: "Lun-Dom 7:00–19:00" },
};

function QRContent() {
  const params = useSearchParams();
  const router = useRouter();

  const materialId = params.get("material") || "plastic";
  const weight = params.get("weight") || "1.0";
  const co2 = params.get("co2") || "2.00";
  const locationId = params.get("location") || "1";

  const mat = materials[materialId] || materials.plastic;
  const loc = locationData[locationId] || locationData["1"];

  const qrCode = `ECO-${Date.now().toString(36).toUpperCase()}-${materialId.toUpperCase().slice(0, 3)}`;

  return (
    <div className="space-y-6 lg:max-w-md lg:mx-auto">
      {/* Success header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
          <Check className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          ¡Registro listo!
        </h1>
        <p className="text-sm text-muted-foreground">
          Muestra este QR en el centro de reciclaje
        </p>
      </div>

      {/* QR Code Display */}
      <div className="rounded-2xl bg-card border border-border p-6 flex flex-col items-center gap-4">
        {/* QR placeholder — a large visual */}
        <div className="w-56 h-56 rounded-2xl bg-white p-4 flex items-center justify-center shadow-inner border border-border">
          {/* Generate a visual QR-like pattern */}
          <div className="w-full h-full relative">
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-0.5">
              {Array.from({ length: 64 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-[2px]"
                  style={{
                    backgroundColor:
                      (i % 7 < 3 && Math.floor(i / 8) < 3) ||
                      (i % 8 > 4 && Math.floor(i / 8) < 3) ||
                      (i % 7 < 3 && Math.floor(i / 8) > 4) ||
                      Math.random() > 0.5
                        ? "#1a1a1a"
                        : "transparent",
                  }}
                />
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: "var(--gradient-primary)" }}
              >
                <QrCode className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs font-mono text-muted-foreground tracking-wider">
          {qrCode}
        </p>

        <button className="flex items-center gap-2 text-sm text-primary font-medium hover:underline">
          <Download className="w-4 h-4" />
          Guardar imagen
        </button>
      </div>

      {/* Transaction details */}
      <div className="rounded-2xl bg-card border border-border p-5 space-y-3">
        <h2 className="font-bold text-foreground text-sm">
          Detalle de la transacción
        </h2>

        <div className="flex items-center justify-between py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">Material</span>
          <span className="text-sm font-medium text-foreground">
            {mat.emoji} {mat.label}
          </span>
        </div>
        <div className="flex items-center justify-between py-2 border-b border-border">
          <span className="text-sm text-muted-foreground">Peso</span>
          <span className="text-sm font-medium text-foreground">
            {weight} kg
          </span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-muted-foreground">CO₂ ahorrado</span>
          <span className="text-sm font-bold text-primary">{co2} kg</span>
        </div>
      </div>

      {/* LocalInfoCard */}
      <div className="rounded-2xl bg-card border border-border p-5 space-y-3">
        <h2 className="font-bold text-foreground text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Centro de acopio
        </h2>
        <div>
          <p className="font-semibold text-foreground">{loc.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {loc.address}
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3" /> {loc.hours}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 pb-4">
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full py-3.5 rounded-xl font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "var(--shadow-eco)",
          }}
        >
          Volver al inicio
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full py-3 rounded-xl border border-destructive/30 text-destructive text-sm font-medium hover:bg-destructive/5 transition-colors flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancelar transacción
        </button>
      </div>
    </div>
  );
}

export default function QRPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <QRContent />
    </Suspense>
  );
}
