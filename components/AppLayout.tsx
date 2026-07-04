"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Bot,
  Building2,
  Home,
  LogOut,
  Plus,
  QrCode,
  Ticket,
  Trophy,
  User,
  Wallet,
} from "lucide-react";

import {
  clearAccessToken,
  getAccessTokenPayload,
  isAdminRole,
  isClientRole,
  isValidatorRole,
} from "@/lib/api";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
  primary?: boolean;
  match?: string[];
};

function buildNavItems(role: string | undefined): NavItem[] {
  const isAdmin = isAdminRole(role);
  const isValidator = isValidatorRole(role);

  return [
    {
      href: isAdmin ? "/admin" : "/dashboard",
      label: "Inicio",
      icon: Home,
      match: isAdmin ? ["/admin"] : ["/dashboard"],
    },
    {
      href: "/gamification",
      label: "Ranking",
      icon: Trophy,
      match: ["/gamification"],
    },
    isAdmin
      ? {
          href: "/admin/centers",
          label: "Centros",
          icon: Building2,
          primary: true,
          match: ["/admin/centers"],
        }
      : isValidator
        ? {
            href: "/collection-center",
            label: "Centro",
            icon: QrCode,
            primary: true,
            match: ["/collection-center"],
          }
        : {
            href: "/dashboard/recycle",
            label: "Registrar",
            icon: Plus,
            primary: true,
            match: ["/dashboard/recycle"],
          },
    {
      href: "/profile",
      label: "Perfil",
      icon: User,
      match: ["/profile"],
    },
  ];
}

function isActive(pathname: string, item: NavItem) {
  if (item.href === "/dashboard") {
    return (
      pathname === "/dashboard" ||
      pathname.startsWith("/dashboard/history") ||
      pathname.startsWith("/dashboard/qr")
    );
  }

  if (item.href === "/gamification") {
    return pathname === "/gamification";
  }

  if (item.href === "/admin") {
    return pathname === item.href;
  }

  if (item.match) {
    return item.match.some((match) => pathname.startsWith(match));
  }

  return pathname === item.href;
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const tokenPayload = getAccessTokenPayload();
  const role = tokenPayload?.role;
  const isAdmin = isAdminRole(role);
  const isClient = isClientRole(role);
  const navItems = buildNavItems(role);
  const homeHref = isAdmin ? "/admin" : "/dashboard";

  const handleLogout = () => {
    clearAccessToken();
    router.replace("/auth/login");
  };

  return (
    <div className="min-h-screen bg-background flex w-full">
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-border bg-sidebar">
        <Link
          href={homeHref}
          onClick={(event) => {
            if (pathname === homeHref) {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex items-center gap-2 px-6 h-16 border-b border-border hover:bg-sidebar-accent/50 transition-colors cursor-pointer"
        >
          <Image
            src="/ecotrack-logo.webp"
            width={32}
            height={32}
            alt="EcoTrack"
            className="drop-shadow-sm"
          />
          <div>
            <p className="font-bold text-foreground text-2xl leading-none">EcoTrack</p>
          </div>
        </Link>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const { href, label, icon: Icon } = item;
            const active = isActive(pathname, item);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}

          {isAdmin ? (
            <>
              <Link
                href="/admin/coupons"
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mt-2",
                  pathname.startsWith("/admin/coupons")
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent",
                )}
              >
                <Ticket className="w-4 h-4" />
                Cupones
              </Link>
            </>
          ) : null}

          <Link
            href="/assistant"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mt-2",
              pathname.startsWith("/assistant")
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-sidebar-foreground hover:bg-sidebar-accent",
            )}
          >
            <Bot className="w-4 h-4" />
            Asistente IA
          </Link>

          {isClient ? (
            <Link
              href="/gamification/wallet"
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname.startsWith("/gamification/wallet")
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              <Wallet className="w-4 h-4" />
              Billetera
            </Link>
          ) : null}
        </nav>

        <div
          className="p-4 m-4 rounded-xl text-primary-foreground text-xs"
          style={{ background: "var(--gradient-primary)" }}
        >
          <p className="font-semibold mb-1">
            {isAdmin ? "Administra con claridad" : "¡Sigue reciclando!"}
          </p>
          <p className="opacity-90">
            {isAdmin
              ? "Supervisa centros, validadores y cupones desde un solo lugar."
              : "Cada gramo cuenta para un planeta mejor."}
          </p>
        </div>

        <div className="px-4 pb-4">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors inline-flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 pb-24 lg:pb-8">
        <header className="lg:hidden sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border h-14 px-4 flex items-center justify-between">
          <Link
            href={homeHref}
            onClick={(event) => {
              if (pathname === homeHref) {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center gap-2"
          >
            <Image
              src="/ecotrack-logo.webp"
              width={28}
              height={28}
              alt="EcoTrack"
              className="drop-shadow-sm"
            />
            <span className="font-bold text-2xl">EcoTrack</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href="/assistant"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20"
            >
              <Bot className="w-5 h-5" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-destructive/10 text-destructive transition-colors hover:bg-destructive/20"
              aria-label="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">{children}</div>
      </main>

      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-20 bg-card/95 backdrop-blur border-t border-border safe-area-pb">
        <div className="grid grid-cols-4 h-16 relative">
          {navItems.map((item) => {
            const { href, label, icon: Icon, primary } = item;
            const active = isActive(pathname, item);

            if (primary) {
              return (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-center"
                  aria-label={label}
                >
                  <span
                    className="-mt-8 w-14 h-14 rounded-full flex items-center justify-center text-primary-foreground shadow-lg transition-transform active:scale-95"
                    style={{
                      background: "var(--gradient-primary)",
                      boxShadow: "var(--shadow-eco)",
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
