"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Eye, EyeOff, Loader2 } from "lucide-react";
import { loginUser, setAccessToken } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await loginUser({ email, password });
      setAccessToken(response.accessToken);
      const nextPath =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("next")
          : null;
      router.push(nextPath ?? "/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo iniciar sesión"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background relative overflow-hidden">
      {/* Decorative blobs */}
      <div
        className="absolute -top-32 -right-32 w-80 h-80 rounded-full opacity-20 blur-3xl pointer-events-none z-0"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none z-0"
        style={{ background: "var(--gradient-primary)" }}
      />

      {/* Left Column - Image (hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-center items-center relative bg-muted/20 border-r border-border/50">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <div className="relative z-10 p-12 flex flex-col items-center text-center">
          <Image
            src="/hero-illustration.webp"
            width={500}
            height={500}
            alt="EcoTrack Illustration"
            className="drop-shadow-2xl mb-8 animate-float"
            priority
          />
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Transforma tus residuos en impacto positivo
          </h2>
          <p className="text-lg text-muted-foreground max-w-md">
            Únete a nuestra comunidad y descubre cómo cada pequeña acción suma para un futuro más verde.
          </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex flex-col justify-center relative z-10 px-6 py-12 sm:px-12 max-w-xl mx-auto w-full h-full">
        <div className="flex flex-col items-center text-center mb-8">
          <Image
            src="/ecotrack-logo.webp"
            width={80}
            height={80}
            alt="EcoTrack Logo"
            className="mb-6 drop-shadow-md"
          />
          <h1 className="text-3xl font-bold text-foreground">Bienvenido de vuelta</h1>
          <p className="text-muted-foreground mt-2">
            Inicia sesión para seguir cuidando el planeta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="login-email"
              type="email"
              required
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-input bg-card pl-11 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <input
              id="login-password"
              type={showPw ? "text" : "password"}
              required
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-input bg-card pl-11 pr-12 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPw ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-xs text-primary font-medium hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-semibold text-primary-foreground flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-70 shadow-lg mt-2"
            style={{
              background: "var(--gradient-primary)",
              boxShadow: "var(--shadow-eco)",
            }}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Iniciar sesión"
            )}
          </button>

          {error && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Accede con tu correo y contraseña. El inicio de sesión con Google no está habilitado.
        </p>

        {/* Register link */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          ¿No tienes cuenta?{" "}
          <Link
            href="/auth/register"
            className="text-primary font-semibold hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
