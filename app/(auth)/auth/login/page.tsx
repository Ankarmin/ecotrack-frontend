"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Mail, Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate auth
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    router.push("/dashboard");
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
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
            o continúa con
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Social Login Buttons - Removed Apple */}
        <div className="flex gap-3">
          <button className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continuar con Google
          </button>
        </div>

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
