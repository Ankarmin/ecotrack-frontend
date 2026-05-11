"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Trophy,
  Users,
  User,
  Plus,
  Leaf,
  Wallet,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
  primary?: boolean;
  match?: string[];
};

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Inicio",
    icon: Home,
    match: ["/dashboard"],
  },
  {
    href: "/gamification",
    label: "Ranking",
    icon: Trophy,
    match: ["/gamification"],
  },
  {
    href: "/dashboard/recycle",
    label: "Registrar",
    icon: Plus,
    primary: true,
  },
  {
    href: "/social",
    label: "Comunidad",
    icon: Users,
    match: ["/social"],
  },
  {
    href: "/profile",
    label: "Perfil",
    icon: User,
    match: ["/profile"],
  },
];

function isActive(pathname: string, item: NavItem) {
  if (item.match) return item.match.some((m) => pathname.startsWith(m));
  return pathname === item.href;
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background flex w-full">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 border-r border-border bg-sidebar">
        <Link 
          href="/dashboard"
          onClick={(e) => {
            if (pathname === "/dashboard") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="flex items-center gap-2 px-6 h-16 border-b border-border hover:bg-sidebar-accent/50 transition-colors cursor-pointer"
        >
          <Image src="/ecotrack-logo.webp" width={32} height={32} alt="EcoTrack" className="drop-shadow-sm" />
          <div>
            <p className="font-bold text-foreground text-2xl leading-none">EcoTrack</p>
          </div>
        </Link>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, { href, label, icon: Icon });
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}

          {/* Extra sidebar-only links */}
          <Link
            href="/assistant"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mt-2",
              pathname.startsWith("/assistant")
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            )}
          >
            <Bot className="w-4 h-4" />
            Asistente IA
          </Link>
          <Link
            href="/gamification/wallet"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname.startsWith("/gamification/wallet")
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            )}
          >
            <Wallet className="w-4 h-4" />
            Billetera
          </Link>
        </nav>

        <div
          className="p-4 m-4 rounded-xl text-primary-foreground text-xs"
          style={{ background: "var(--gradient-primary)" }}
        >
          <p className="font-semibold mb-1">¡Sigue reciclando!</p>
          <p className="opacity-90">
            Cada gramo cuenta para un planeta mejor.
          </p>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 lg:ml-64 pb-24 lg:pb-8">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border h-14 px-4 flex items-center justify-between">
          <Link
            href="/dashboard"
            onClick={(e) => {
              if (pathname === "/dashboard") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center gap-2"
          >
            <Image src="/ecotrack-logo.webp" width={28} height={28} alt="EcoTrack" className="drop-shadow-sm" />
            <span className="font-bold text-2xl">EcoTrack</span>
          </Link>
          
          <Link href="/assistant" className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary/20">
            <Bot className="w-5 h-5" />
          </Link>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">{children}</div>
      </main>

      {/* ── Mobile Bottom Tab Bar (Thumb Zone) ── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-20 bg-card/95 backdrop-blur border-t border-border safe-area-pb">
        <div className="grid grid-cols-5 h-16 relative">
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
                  active ? "text-primary" : "text-muted-foreground"
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