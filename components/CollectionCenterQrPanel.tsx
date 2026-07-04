"use client";

import { Camera, Loader2, QrCode, ScanLine, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type BarcodeDetectorResult = {
  rawValue?: string;
};

type BarcodeDetectorApi = new (options?: {
  formats?: string[];
}) => {
  detect(source: ImageBitmapSource): Promise<BarcodeDetectorResult[]>;
};

export function CollectionCenterQrPanel({
  onValidate,
  disabled = false,
}: {
  onValidate: (qrCode: string) => Promise<void>;
  disabled?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [scannerEnabled, setScannerEnabled] = useState(false);
  const [scannerReady, setScannerReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scannerAvailable =
    typeof window !== "undefined" &&
    Boolean((window as Window & { BarcodeDetector?: BarcodeDetectorApi }).BarcodeDetector) &&
    Boolean(navigator.mediaDevices?.getUserMedia);

  useEffect(() => {
    if (!scannerEnabled) {
      return;
    }

    const BarcodeDetectorCtor = (
      window as Window & { BarcodeDetector?: BarcodeDetectorApi }
    ).BarcodeDetector;

    if (!BarcodeDetectorCtor || !navigator.mediaDevices?.getUserMedia) {
      return;
    }

    const detector = new BarcodeDetectorCtor({ formats: ["qr_code"] });
    let stream: MediaStream | null = null;
    let frameId = 0;
    let cancelled = false;

    const cleanup = () => {
      setScannerReady(false);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
      if (stream) {
        for (const track of stream.getTracks()) {
          track.stop();
        }
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

    const scanFrame = async () => {
      if (cancelled) {
        return;
      }

      const video = videoRef.current;

      if (video && video.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
        try {
          const barcodes = await detector.detect(video);
          const scannedCode = barcodes.find(
            (barcode) => typeof barcode.rawValue === "string" && barcode.rawValue.trim(),
          )?.rawValue;

          if (scannedCode) {
            setManualCode(scannedCode.trim());
            setScannerEnabled(false);
            return;
          }
        } catch {
          setError("No se pudo leer el QR. Intenta de nuevo o ingresa el código.");
          setScannerEnabled(false);
          return;
        }
      }

      frameId = window.requestAnimationFrame(() => {
        void scanFrame();
      });
    };

    const startScanner = async () => {
      try {
        setError(null);
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: "environment",
            },
          },
          audio: false,
        });

        if (cancelled) {
          cleanup();
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setScannerReady(true);
          frameId = window.requestAnimationFrame(() => {
            void scanFrame();
          });
        }
      } catch {
        setError("No se pudo abrir la cámara. Revisa permisos o usa el ingreso manual.");
        setScannerEnabled(false);
      }
    };

    void startScanner();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [scannerEnabled]);

  const handleSubmit = async () => {
    const qrCode = manualCode.trim();

    if (!qrCode) {
      setError("Escanea o ingresa un código QR antes de continuar.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await onValidate(qrCode);
      setManualCode("");
      setScannerEnabled(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "No se pudo validar el reciclaje",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-start gap-3">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-primary-foreground shrink-0"
          style={{ background: "var(--gradient-primary)" }}
        >
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">Validar reciclaje por QR</h2>
          <p className="text-sm text-muted-foreground">
            Escanea el código o ingresalo manualmente para confirmar la llegada.
          </p>
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Código QR</label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <QrCode className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={manualCode}
                onChange={(event) => {
                  setManualCode(event.target.value);
                  if (error) {
                    setError(null);
                  }
                }}
                placeholder="Ej. ECO-ABC123"
                className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                disabled={disabled || submitting}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                if (!scannerEnabled && !scannerAvailable) {
                  setError("Tu navegador no admite escaneo directo. Usa el ingreso manual.");
                  return;
                }

                if (error) {
                  setError(null);
                }

                setScannerEnabled((current) => !current);
              }}
              className="rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground hover:border-primary/40 transition-colors disabled:opacity-70 flex items-center gap-2"
              disabled={disabled || submitting}
            >
              <Camera className="w-4 h-4 text-primary" />
              {scannerEnabled ? "Cerrar" : "Escanear"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              void handleSubmit();
            }}
            disabled={disabled || submitting}
            className="w-full rounded-xl py-3.5 font-semibold text-primary-foreground transition-transform active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
            style={{
              background: "var(--gradient-primary)",
              boxShadow: "var(--shadow-eco)",
            }}
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanLine className="w-4 h-4" />}
            Confirmar llegada
          </button>
        </div>

        <div className="rounded-2xl border border-dashed border-border bg-background/80 overflow-hidden min-h-56">
          {scannerEnabled ? (
            <div className="h-full flex flex-col">
              <div className="relative flex-1 min-h-56 bg-black">
                <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
                <div className="absolute inset-4 rounded-2xl border-2 border-white/80 border-dashed" />
                {!scannerReady ? (
                  <div className="absolute inset-0 flex items-center justify-center text-white/90 text-sm gap-2 bg-black/40">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Preparando cámara...
                  </div>
                ) : null}
              </div>
              <div className="px-4 py-3 text-xs text-muted-foreground">
                Centra el QR dentro del marco para capturarlo automaticamente.
              </div>
            </div>
          ) : (
            <div className="h-full min-h-56 flex flex-col items-center justify-center gap-3 px-6 text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <ScanLine className="w-7 h-7" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Escaneo rapido</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Usa la cámara del dispositivo o valida el código de forma manual.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
