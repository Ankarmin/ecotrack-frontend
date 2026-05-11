import Link from "next/link";
import Image from "next/image";
import {
  Leaf,
  Recycle,
  Trophy,
  Globe,
  BarChart3,
  Users,
  MapPin,
  ArrowRight,
  Cloud,
  TreePine,
  Zap,
  Shield,
  Heart,
  ChevronRight,
  Star,
  Mail,
  Instagram,
  Twitter,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EcoTrack — Recicla, mide tu impacto, salva el planeta",
  description:
    "Monitorea tu reciclaje, gana EcoPuntos, compite con tu comunidad y contribuye a los ODS 11, 12 y 13 de la ONU.",
};

/* ─────────────────────────── DATA ─────────────────────────── */

const navLinks = [
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Impacto", href: "#impacto" },
  { label: "Comunidad", href: "#comunidad" },
];

const steps = [
  {
    number: "01",
    icon: Recycle,
    title: "Registra tu reciclaje",
    description:
      "Selecciona el material, indica el peso y elige el centro de acopio más cercano desde tu celular.",
  },
  {
    number: "02",
    icon: BarChart3,
    title: "Mide tu impacto",
    description:
      "Ve en tiempo real cuántos kg de CO₂ ahorraste y cuántos árboles equivalentes has plantado.",
  },
  {
    number: "03",
    icon: Trophy,
    title: "Gana recompensas",
    description:
      "Acumula EcoPuntos, sube en el ranking semanal y canjea premios en nuestros aliados locales.",
  },
];

const stats = [
  { value: "12,450+", label: "Usuarios activos", icon: Users },
  { value: "42 ton", label: "CO₂ ahorrado", icon: Cloud },
  { value: "8,200+", label: "Árboles equivalentes", icon: TreePine },
  { value: "35+", label: "Centros de acopio", icon: MapPin },
];

const features = [
  {
    icon: Zap,
    title: "Gamificación inteligente",
    description:
      "Rankings semanales, rachas, badges y EcoPuntos canjeables por descuentos reales.",
  },
  {
    icon: Globe,
    title: "Alineado con los ODS",
    description:
      "Cada reciclaje contribuye directamente a los ODS 11 (Ciudades sostenibles), 12 (Consumo responsable) y 13 (Acción climática).",
  },
  {
    icon: Shield,
    title: "Privacidad primero",
    description:
      "Tu información personal está protegida. Solo tú decides qué compartir con la comunidad.",
  },
  {
    icon: Heart,
    title: "Comunidad activa",
    description:
      "Sigue a amigos, aplaude sus logros y motívense mutuamente para cuidar el planeta.",
  },
];

const testimonials = [
  {
    name: "Lucía Fernández",
    handle: "@luciaeco",
    avatar: "LF",
    quote:
      "Con EcoTrack reciclar dejó de ser una tarea y se convirtió en un juego. ¡Ya llevo 14 días de racha!",
    co2: "142 kg CO₂",
  },
  {
    name: "Carlos Ruiz",
    handle: "@cruiz",
    avatar: "CR",
    quote:
      "Me encanta competir en el ranking. Mis vecinos y yo ahora reciclamos más que nunca.",
    co2: "98 kg CO₂",
  },
  {
    name: "Ana Torres",
    handle: "@anat",
    avatar: "AT",
    quote:
      "Los EcoPuntos son geniales. Ya canjeé descuentos en el supermercado y donaciones a ONGs.",
    co2: "76 kg CO₂",
  },
];

const footerLinks = {
  Producto: [
    { label: "Cómo funciona", href: "#como-funciona" },
    { label: "Impacto", href: "#impacto" },
    { label: "Comunidad", href: "#comunidad" },
    { label: "Recompensas", href: "#como-funciona" },
  ],
  Legal: [
    { label: "Privacidad", href: "#" },
    { label: "Términos de uso", href: "#" },
    { label: "Cookies", href: "#" },
  ],
  Soporte: [
    { label: "Centro de ayuda", href: "#" },
    { label: "Contacto", href: "#" },
    { label: "FAQ", href: "#" },
  ],
};

/* ─────────────────────────── PAGE ─────────────────────────── */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ════════════════ HEADER ════════════════ */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 group"
          >
            <Image
              src="/ecotrack-logo.webp"
              alt="EcoTrack Logo"
              width={36}
              height={36}
              className="rounded-xl transition-transform group-hover:scale-105"
            />
            <div>
              <span className="font-bold text-foreground text-lg leading-none">
                EcoTrack
              </span>
              <span className="hidden sm:block text-[9px] text-muted-foreground leading-none mt-0.5">
                ODS 11 · 12 · 13
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <Link
            href="/auth/login"
            id="cta-header"
            className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.97] hover:opacity-90 shadow-md"
            style={{
              background: "var(--gradient-primary)",
              boxShadow: "var(--shadow-eco)",
            }}
          >
            Iniciar Ahora
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* ════════════════ HERO ════════════════ */}
      <section className="relative overflow-hidden">
        {/* Decorative blobs */}
        <div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl pointer-events-none animate-blob"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div
          className="absolute top-1/2 -left-60 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none animate-blob"
          style={{ background: "var(--gradient-primary)", animationDelay: "2s" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left column — Text */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-8">
                <Globe className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Contribuye a los ODS de la ONU
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                Recicla con propósito.{" "}
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: "var(--gradient-hero)",
                  }}
                >
                  Mide tu impacto.
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Registra tu reciclaje, gana EcoPuntos, compite en rankings
                semanales y demuestra que cada gramo cuenta para un planeta mejor.
              </p>

              {/* Hero CTAs */}
              <div className="mt-10 flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
                <Link
                  href="/auth/login"
                  id="cta-hero"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold text-primary-foreground transition-all duration-300 active:scale-[0.97] hover:scale-105 hover:-translate-y-1 hover:shadow-2xl shadow-lg"
                  style={{
                    background: "var(--gradient-primary)",
                    boxShadow: "var(--shadow-eco)",
                  }}
                >
                  Iniciar Ahora
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a
                  href="#como-funciona"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-semibold text-foreground border border-border bg-card hover:bg-secondary/50 transition-colors"
                >
                  Cómo funciona
                </a>
              </div>

              {/* Social proof */}
              <div className="mt-12 flex items-center justify-center lg:justify-start gap-6 flex-wrap">
                <div className="flex -space-x-3">
                  {["LF", "CR", "AT", "MG", "DL"].map((initials, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold text-primary-foreground"
                      style={{ background: "var(--gradient-primary)" }}
                    >
                      {initials}
                    </div>
                  ))}
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className="w-4 h-4 text-amber-400 fill-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Amado por <strong className="text-foreground">12,450+</strong>{" "}
                    ecowarriors
                  </p>
                </div>
              </div>
            </div>

            {/* Right column — Illustration */}
            <div className="hidden lg:flex items-center justify-center relative">
              <div className="relative w-full max-w-lg aspect-square">
                {/* Glow behind image */}
                <div
                  className="absolute inset-0 rounded-full opacity-20 blur-3xl scale-90"
                  style={{ background: "var(--gradient-hero)" }}
                />
                <Image
                  src="/hero-illustration.webp"
                  alt="Ilustración 3D de un planeta verde rodeado de símbolos de reciclaje"
                  width={600}
                  height={600}
                  priority
                  className="relative z-10 w-full h-auto drop-shadow-2xl animate-float"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ STATS BAR ════════════════ */}
      <section className="border-y border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-3xl sm:text-4xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ CÓMO FUNCIONA ════════════════ */}
      <section id="como-funciona" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Cómo funciona
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground">
              Tres pasos para cambiar el mundo
            </h2>
            <p className="mt-4 text-muted-foreground">
              Reciclar nunca fue tan fácil. Registra, mide y gana en menos de un
              minuto.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative rounded-2xl bg-card border border-border p-8 hover:shadow-lg hover:border-primary/20 transition-all group"
              >
                {/* Step number */}
                <span
                  className="text-5xl font-bold bg-clip-text text-transparent opacity-30 group-hover:opacity-50 transition-opacity"
                  style={{ backgroundImage: "var(--gradient-primary)" }}
                >
                  {step.number}
                </span>

                <div
                  className="mt-4 w-12 h-12 rounded-xl flex items-center justify-center text-primary-foreground transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3 group-hover:shadow-lg"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <step.icon className="w-6 h-6" />
                </div>

                <h3 className="mt-5 text-xl font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ IMPACTO / FEATURES ════════════════ */}
      <section id="impacto" className="py-20 lg:py-28 bg-card/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Impacto real
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground">
              Más que una app de reciclaje
            </h2>
            <p className="mt-4 text-muted-foreground">
              EcoTrack combina gamificación, comunidad y datos reales para
              maximizar tu contribución ecológica.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feat) => (
              <div
                key={feat.title}
                className="group rounded-2xl bg-card border border-border p-6 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/30 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                  <feat.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">{feat.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ COMUNIDAD / TESTIMONIOS ════════════════ */}
      <section id="comunidad" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">
              Comunidad
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-foreground">
              Lo que dicen nuestros ecowarriors
            </h2>
            <p className="mt-4 text-muted-foreground">
              Miles de personas ya están transformando sus hábitos de reciclaje
              con EcoTrack.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.handle}
                className="rounded-2xl bg-card border border-border p-6 flex flex-col"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-foreground leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="mt-5 flex items-center gap-3 pt-4 border-t border-border">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-primary-foreground"
                    style={{ background: "var(--gradient-primary)" }}
                  >
                    {t.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{t.handle}</p>
                  </div>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md">
                    {t.co2}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════ CTA FINAL ════════════════ */}
      <section className="py-20 lg:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-3xl p-10 sm:p-14 text-center text-primary-foreground relative overflow-hidden transition-transform duration-500 hover:scale-[1.02]"
            style={{
              background: "var(--gradient-hero)",
              boxShadow: "var(--shadow-eco)",
            }}
          >
            {/* Decorative circles */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border-2 border-white/30" />
              <div className="absolute bottom-0 left-10 w-56 h-56 rounded-full border-2 border-white/20" />
            </div>

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold">
                ¿Listo para hacer la diferencia?
              </h2>
              <p className="mt-4 text-lg opacity-90 max-w-lg mx-auto">
                Únete a miles de personas que ya están transformando el reciclaje
                en algo divertido e impactante.
              </p>
              <Link
                href="/auth/login"
                id="cta-final"
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-white text-foreground px-8 py-4 text-base font-semibold hover:bg-white/90 transition-colors shadow-lg"
              >
                Iniciar Ahora
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════ FOOTER ════════════════ */}
      <footer className="border-t border-border bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
            {/* Brand column */}
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/ecotrack-logo.webp"
                  alt="EcoTrack Logo"
                  width={36}
                  height={36}
                  className="rounded-xl"
                />
                <div>
                  <span className="font-bold text-foreground text-lg">
                    EcoTrack
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                Monitorea tu reciclaje, mide tu impacto en CO₂ y contribuye a
                los Objetivos de Desarrollo Sostenible 11, 12 y 13 de la ONU.
              </p>

              {/* Social */}
              <div className="mt-6 flex items-center gap-3">
                <a
                  href="#"
                  className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="#"
                  className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-semibold text-foreground text-sm mb-4">
                  {title}
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} EcoTrack. Todos los derechos
              reservados.
            </p>
            <p className="text-xs text-muted-foreground">
              Hecho con 💚 para el planeta
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
