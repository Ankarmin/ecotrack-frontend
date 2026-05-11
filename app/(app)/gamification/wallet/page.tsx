"use client";

import { useState } from "react";
import {
  Wallet,
  Gift,
  Star,
  TrendingUp,
  ChevronRight,
  X,
  ShoppingBag,
  Coffee,
  Bike,
} from "lucide-react";
import { cn } from "@/lib/utils";

const rewards = [
  {
    id: "1",
    title: "15% dcto. Supermercados Wong",
    cost: 500,
    category: "Compras",
    icon: ShoppingBag,
    color: "bg-blue-500",
    available: true,
  },
  {
    id: "2",
    title: "Café gratis en Starbucks",
    cost: 300,
    category: "Alimentos",
    icon: Coffee,
    color: "bg-amber-600",
    available: true,
  },
  {
    id: "3",
    title: "1 mes BiciLima Premium",
    cost: 800,
    category: "Transporte",
    icon: Bike,
    color: "bg-green-600",
    available: true,
  },
  {
    id: "4",
    title: "Bolsa reutilizable EcoTrack",
    cost: 150,
    category: "Merch",
    icon: Gift,
    color: "bg-purple-500",
    available: true,
  },
  {
    id: "5",
    title: "Donación a ONG ambiental",
    cost: 200,
    category: "Impacto",
    icon: Star,
    color: "bg-emerald-500",
    available: true,
  },
  {
    id: "6",
    title: "20% dcto. Plaza Vea",
    cost: 600,
    category: "Compras",
    icon: ShoppingBag,
    color: "bg-red-500",
    available: false,
  },
];

export default function WalletPage() {
  const [balance] = useState(1_240);
  const [redeemModal, setRedeemModal] = useState<string | null>(null);
  const [redeemed, setRedeemed] = useState(false);

  const selectedReward = rewards.find((r) => r.id === redeemModal);

  const handleRedeem = () => {
    setRedeemed(true);
    setTimeout(() => {
      setRedeemModal(null);
      setRedeemed(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* ── BalanceCard ── */}
      <div
        className="rounded-2xl p-6 text-primary-foreground relative overflow-hidden"
        style={{
          background: "var(--gradient-hero)",
          boxShadow: "var(--shadow-eco)",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-2 border-white/30" />
          <div className="absolute bottom-0 right-12 w-48 h-48 rounded-full border-2 border-white/20" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5" />
            <span className="text-sm opacity-90">Tu saldo de EcoPuntos</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold tabular-nums tracking-tight">
              {balance.toLocaleString()}
            </span>
            <span className="text-lg opacity-80">pts</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm opacity-90">
            <TrendingUp className="w-4 h-4" />
            <span>+180 esta semana</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-card border border-border p-3 text-center">
          <p className="text-xs text-muted-foreground">Canjeados</p>
          <p className="text-lg font-bold text-foreground">3</p>
        </div>
        <div className="rounded-xl bg-card border border-border p-3 text-center">
          <p className="text-xs text-muted-foreground">Ganados hoy</p>
          <p className="text-lg font-bold text-primary">+45</p>
        </div>
        <div className="rounded-xl bg-card border border-border p-3 text-center">
          <p className="text-xs text-muted-foreground">Nivel</p>
          <p className="text-lg font-bold text-foreground">Oro</p>
        </div>
      </div>

      {/* ── RewardGrid ── */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">
          Canjea tus puntos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward) => {
            const Icon = reward.icon;
            const canAfford = balance >= reward.cost;

            return (
              <button
                key={reward.id}
                disabled={!reward.available || !canAfford}
                onClick={() => setRedeemModal(reward.id)}
                className={cn(
                  "rounded-2xl bg-card border border-border p-5 text-left transition-all group",
                  reward.available && canAfford
                    ? "hover:shadow-md hover:border-primary/30"
                    : "opacity-60 cursor-not-allowed"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0",
                      reward.color
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-tight">
                      {reward.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {reward.category}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-primary">
                    {reward.cost} pts
                  </span>
                  {reward.available && canAfford && (
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  )}
                  {!reward.available && (
                    <span className="text-[10px] text-muted-foreground">
                      Agotado
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── RedeemModal ── */}
      {redeemModal && selectedReward && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          onClick={() => !redeemed && setRedeemModal(null)}
        >
          <div className="absolute inset-0 bg-black/40 animate-in fade-in duration-200" />
          <div
            className="relative bg-card rounded-t-3xl sm:rounded-2xl p-6 w-full max-w-md space-y-5 animate-in slide-in-from-bottom sm:slide-in-from-bottom-4 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 rounded-full bg-muted mx-auto sm:hidden" />

            {redeemed ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <Star className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground">
                  ¡Canjeado!
                </h3>
                <p className="text-sm text-muted-foreground">
                  Revisa tu correo para los detalles del canje.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-foreground">Confirmar canje</h3>
                  <button
                    onClick={() => setRedeemModal(null)}
                    className="p-1 rounded-lg hover:bg-secondary text-muted-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-white",
                      selectedReward.color
                    )}
                  >
                    <selectedReward.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {selectedReward.title}
                    </p>
                    <p className="text-sm text-primary font-bold">
                      {selectedReward.cost} EcoPuntos
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-secondary/50 p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saldo actual</span>
                    <span className="font-medium text-foreground">
                      {balance.toLocaleString()} pts
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-muted-foreground">Después del canje</span>
                    <span className="font-medium text-foreground">
                      {(balance - selectedReward.cost).toLocaleString()} pts
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleRedeem}
                  className="w-full py-3.5 rounded-xl font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
                  style={{
                    background: "var(--gradient-primary)",
                    boxShadow: "var(--shadow-eco)",
                  }}
                >
                  Confirmar canje
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
