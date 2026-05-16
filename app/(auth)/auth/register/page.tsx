"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Eye, EyeOff, Loader2, User } from "lucide-react";
import { registerUser, setAccessToken } from "@/lib/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
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
      const response = await registerUser({ name, email, password });
      setAccessToken(response.accessToken);
      const nextPath =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("next")
          : null;
      router.push(nextPath ?? "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo crear la cuenta");
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

      {/* Right Column - Image (hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-center items-center relative bg-muted/20 border-l border-border/50 order-last">
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
            Cada pequeño esfuerzo cuenta
          </h2>
          <p className="text-lg text-muted-foreground max-w-md">
            Al registrarte en EcoTrack, das el primer paso hacia un futuro más sostenible para todos.
          </p>
        </div>
      </div>

      {/* Left Column - Form */}
      <div className="flex flex-col justify-center relative z-10 px-6 py-12 sm:px-12 max-w-xl mx-auto w-full h-full">
        <div className="flex flex-col items-center text-center mb-8">
          <Image
            src="/ecotrack-logo.webp"
            width={80}
            height={80}
            alt="EcoTrack Logo"
            className="mb-6 drop-shadow-md"
          />
          <h1 className="text-3xl font-bold text-foreground">Crea tu cuenta</h1>
          <p className="text-muted-foreground mt-2">
            Únete a la comunidad que cuida el planeta
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="register-name"
              type="text"
              required
              placeholder="Nombre completo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-input bg-card pl-11 pr-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              id="register-email"
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
              id="register-password"
              type={showPw ? "text" : "password"}
              required
              minLength={8}
              placeholder="Contraseña (mín. 8 caracteres)"
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
              {showPw ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
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
              "Crear cuenta"
            )}
          </button>

          {error && (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Crea tu cuenta con correo y contraseña. El registro con Google no está habilitado.
        </p>

        <p className="text-center text-sm text-muted-foreground mt-8">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/auth/login"
            className="text-primary font-semibold hover:underline"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
