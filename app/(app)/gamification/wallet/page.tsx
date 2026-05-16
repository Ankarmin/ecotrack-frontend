"use client";

import { useEffect, useState } from "react";
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
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ApiError,
  clearAccessToken,
  getAccessToken,
  getWallet,
  redeemReward,
  type Reward,
  type WalletResponse,
} from "@/lib/api";

const iconMap = {
  "shopping-bag": ShoppingBag,
  coffee: Coffee,
  bike: Bike,
  gift: Gift,
  star: Star,
} as const;

export default function WalletPage() {
  const router = useRouter();
  const [walletData, setWalletData] = useState<WalletResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redeemModal, setRedeemModal] = useState<string | null>(null);
  const [redeemed, setRedeemed] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    let ignore = false;

    const loadWallet = async () => {
      const token = getAccessToken();

      if (!token) {
        router.replace("/auth/login?next=%2Fgamification%2Fwallet");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getWallet(token);

        if (!ignore) {
          setWalletData(data);
        }
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          clearAccessToken();
          router.replace("/auth/login?next=%2Fgamification%2Fwallet");
          return;
        }

        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo cargar la billetera"
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadWallet();

    return () => {
      ignore = true;
    };
  }, [router]);

  const rewards = walletData?.rewards ?? [];
  const balance = walletData?.wallet.balance ?? 0;

  const selectedReward = rewards.find((r) => r.id === redeemModal);

  const handleRedeem = async () => {
    if (!selectedReward) {
      return;
    }

    const token = getAccessToken();

    if (!token) {
      clearAccessToken();
      router.replace("/auth/login?next=%2Fgamification%2Fwallet");
      return;
    }

    try {
      setRedeeming(true);
      setError(null);

      const response = await redeemReward(token, selectedReward.id);

      setWalletData((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          wallet: response.wallet,
          recentRedemptions: [response.redemption, ...current.recentRedemptions].slice(
            0,
            10
          ),
        };
      });

      setRedeemed(true);
      setTimeout(() => {
        setRedeemModal(null);
        setRedeemed(false);
      }, 2000);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearAccessToken();
        router.replace("/auth/login?next=%2Fgamification%2Fwallet");
        return;
      }

      setError(
        err instanceof Error ? err.message : "No se pudo completar el canje"
      );
    } finally {
      setRedeeming(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-primary">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!walletData) {
    return (
      <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-destructive">
        {error ?? "No se pudo cargar la billetera"}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

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
            <span>+{walletData.wallet.weeklyChange} esta semana</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-card border border-border p-3 text-center">
          <p className="text-xs text-muted-foreground">Canjeados</p>
          <p className="text-lg font-bold text-foreground">
            {walletData.wallet.redeemedCount}
          </p>
        </div>
        <div className="rounded-xl bg-card border border-border p-3 text-center">
          <p className="text-xs text-muted-foreground">Ganados hoy</p>
          <p className="text-lg font-bold text-primary">
            +{walletData.wallet.earnedToday}
          </p>
        </div>
        <div className="rounded-xl bg-card border border-border p-3 text-center">
          <p className="text-xs text-muted-foreground">Nivel</p>
          <p className="text-lg font-bold text-foreground">
            {walletData.wallet.level}
          </p>
        </div>
      </div>

      {/* ── RewardGrid ── */}
      <div>
        <h2 className="text-lg font-bold text-foreground mb-4">
          Canjea tus puntos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rewards.map((reward: Reward) => {
            const Icon = iconMap[reward.icon as keyof typeof iconMap] ?? Gift;
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
                    {(() => {
                      const SelectedIcon =
                        iconMap[selectedReward.icon as keyof typeof iconMap] ?? Gift;

                      return <SelectedIcon className="w-6 h-6" />;
                    })()}
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
                  disabled={redeeming}
                  className="w-full py-3.5 rounded-xl font-semibold text-primary-foreground transition-transform active:scale-[0.98]"
                  style={{
                    background: "var(--gradient-primary)",
                    boxShadow: "var(--shadow-eco)",
                  }}
                >
                  {redeeming ? "Procesando..." : "Confirmar canje"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
