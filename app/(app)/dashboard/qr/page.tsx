"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  QrCode,
  MapPin,
  Clock,
  X,
  Check,
  Download,
} from "lucide-react";
import QRCode from "qrcode";

function getQrSeedHash(seed: string) {
  return Array.from(seed).reduce(
    (hash, char, index) => hash + char.charCodeAt(0) * (index + 1),
    0,
  );
}

function isFilledQrCell(index: number, hash: number) {
  const row = Math.floor(index / 8);
  const column = index % 8;
  const isFinderPattern =
    (column < 3 && row < 3) ||
    (column > 4 && row < 3) ||
    (column < 3 && row > 4);

  if (isFinderPattern) {
    return true;
  }

  return (hash + row * 17 + column * 31 + index * 7) % 2 === 0;
}

function QRContent() {
  const params = useSearchParams();
  const router = useRouter();
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);

  const recordId = params.get("recordId") || "";
  const materialName = params.get("material") || "Material";
  const weight = params.get("weight") || "1.0";
  const co2 = params.get("co2") || "2.00";
  const locationName = params.get("location") || "Centro de reciclaje";
  const qrCode = params.get("qr") || "QR-NO-DISPONIBLE";
  const status = params.get("status") || "Pendiente";

  useEffect(() => {
    let ignore = false;

    const buildQrImage = async () => {
      try {
        const dataUrl = await QRCode.toDataURL(qrCode, {
          errorCorrectionLevel: "M",
          margin: 1,
          width: 448,
          color: {
            dark: "#111827",
            light: "#FFFFFF",
          },
        });

        if (!ignore) {
          setQrImageUrl(dataUrl);
        }
      } catch {
        if (!ignore) {
          setQrImageUrl(null);
        }
      }
    };

    void buildQrImage();

    return () => {
      ignore = true;
    };
  }, [qrCode]);

  const qrSeedHash = getQrSeedHash(
    `${recordId}:${materialName}:${weight}:${co2}:${locationName}:${qrCode}:${status}`,
  );

  const downloadQr = () => {
    if (!qrImageUrl || typeof document === "undefined") {
      return;
    }

    const link = document.createElement("a");
    link.href = qrImageUrl;
    link.download = `${qrCode}.png`;
    link.click();
  };

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
          {qrImageUrl ? (
            <Image
              src={qrImageUrl}
              alt={`QR ${qrCode}`}
              width={224}
              height={224}
              unoptimized
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full relative">
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 gap-0.5">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-[2px]"
                    style={{
                      backgroundColor: isFilledQrCell(i, qrSeedHash)
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
          )}
        </div>

        <p className="text-xs font-mono text-muted-foreground tracking-wider">
          {qrCode}
        </p>

        <button
          type="button"
          onClick={downloadQr}
          className="flex items-center gap-2 text-sm text-primary font-medium hover:underline"
        >
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
            ♻️ {materialName}
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
        <div className="flex items-center justify-between py-2 border-t border-border">
          <span className="text-sm text-muted-foreground">Estado</span>
          <span className="text-sm font-medium text-foreground">{status}</span>
        </div>
        {recordId && (
          <div className="flex items-center justify-between py-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Registro</span>
            <span className="text-xs font-mono text-foreground">{recordId}</span>
          </div>
        )}
      </div>

      {/* LocalInfoCard */}
      <div className="rounded-2xl bg-card border border-border p-5 space-y-3">
        <h2 className="font-bold text-foreground text-sm flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Centro de acopio
        </h2>
        <div>
          <p className="font-semibold text-foreground">{locationName}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3" /> Presenta este QR al validar tu entrega
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
