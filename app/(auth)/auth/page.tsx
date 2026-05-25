"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Recycle, Trophy, Globe, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const slides = [
  {
    icon: Recycle,
    title: "Recicla con propósito",
    description:
      "Registra cada material que reciclas y observa cómo tu esfuerzo diario genera un impacto real en el planeta.",
    accent: "oklch(0.55 0.16 152)",
    emoji: "♻️",
  },
  {
    icon: Trophy,
    title: "Gana EcoPuntos",
    description:
      "Cada gramo reciclado te acerca a recompensas exclusivas. Compite en el ranking semanal y destaca en tu comunidad.",
    accent: "oklch(0.85 0.14 90)",
    emoji: "🏆",
  },
  {
    icon: Globe,
    title: "Salva el Planeta",
    description:
      "Contribuye a los ODS 11, 12 y 13 de la ONU. Tu impacto se mide en CO₂ ahorrado y árboles equivalentes.",
    accent: "oklch(0.55 0.16 152)",
    emoji: "🌍",
  },
];

export default function OnboardingPage() {
  const [current, setCurrent] = useState(0);
  const router = useRouter();
  const isLast = current === slides.length - 1;

  const next = () => {
    if (isLast) {
      router.push("/auth/login");
    } else {
      setCurrent((p) => p + 1);
    }
  };

  const skip = () => router.push("/auth/login");

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Decorative gradient blobs */}
      <div
        className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "var(--gradient-primary)" }}
      />

      {/* Skip */}
      <div className="flex justify-end p-4 relative z-10">
        <button
          onClick={skip}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg"
        >
          Saltar
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        {/* Logo */}
        <Image
          src="/ecotrack-logo.webp"
          width={80}
          height={80}
          alt="EcoTrack Logo"
          className="mb-10 drop-shadow-lg animate-float"
        />

        {/* Slide */}
        <div className="max-w-sm text-center">
          <div
            key={current}
            className="animate-in fade-in slide-in-from-right-4 duration-300"
          >
            <div className="text-6xl mb-6">{slides[current].emoji}</div>
            <h1 className="text-3xl font-bold text-foreground mb-3">
              {slides[current].title}
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              {slides[current].description}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom area: indicators + button */}
      <div className="relative z-10 px-6 pb-10 flex flex-col items-center gap-8">
        {/* Carousel Indicators */}
        <div className="flex gap-2" role="tablist" aria-label="Diapositivas">
          {slides.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === current}
              aria-label={`Ir a diapositiva ${i + 1}`}
              onClick={() => setCurrent(i)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === current
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              )}
            />
          ))}
        </div>

        {/* Primary CTA */}
        <button
          onClick={next}
          className="w-full max-w-sm py-4 rounded-2xl font-semibold text-primary-foreground flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-lg"
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "var(--shadow-eco)",
          }}
        >
          {isLast ? "Comenzar" : "Siguiente"}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
