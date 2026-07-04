"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Award,
  Crown,
  Flame,
  Loader2,
  Medal,
  Scale,
  Ticket,
  Trophy,
} from "lucide-react";

import {
  ApiError,
  clearAccessToken,
  getAccessToken,
  getAccessTokenPayload,
  getAdminWeeklyCenterRanking,
  getClientWeeklyRanking,
  getValidatorWeeklyClientRanking,
  isAdminRole,
  isClientRole,
  isValidatorRole,
  type ValidatorWeeklyClientRankingResponse,
  type WeeklyCenterRankingResponse,
  type WeeklyClientRankingResponse,
} from "@/lib/api";
import { cn } from "@/lib/utils";

type RankingViewModel = {
  id: string;
  rank: number;
  title: string;
  subtitle: string;
  detail: string;
  totalWeightKg: number;
  totalRecords: number;
  totalPoints: number;
  validatedRecords: number;
  pendingRecords: number;
  isCurrentUser?: boolean;
  isCenter?: boolean;
};

const podiumIcon = [Crown, Medal, Award];

function formatPeriod(startAt: string, endAt: string) {
  const start = new Date(startAt).toLocaleDateString();
  const end = new Date(new Date(endAt).getTime() - 1).toLocaleDateString();
  return `${start} - ${end}`;
}

export default function GamificationPage() {
  const router = useRouter();
  const tokenPayload = getAccessTokenPayload();
  const [rankingEntries, setRankingEntries] = useState<RankingViewModel[]>([]);
  const [periodLabel, setPeriodLabel] = useState("");
  const [title, setTitle] = useState("Ranking semanal");
  const [subtitle, setSubtitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadRanking = async () => {
      const token = getAccessToken();

      if (!token) {
        router.replace("/auth/login?next=%2Fgamification");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        if (isAdminRole(tokenPayload?.role)) {
          const response = await getAdminWeeklyCenterRanking(token);

          if (ignore) {
            return;
          }

          setTitle("Ranking semanal de centros");
          setSubtitle("Centros de acopio con mayor reciclaje registrado esta semana");
          setPeriodLabel(formatPeriod(response.period.startAt, response.period.endAt));
          setRankingEntries(mapCenterRanking(response));
          return;
        }

        if (isValidatorRole(tokenPayload?.role)) {
          const response = await getValidatorWeeklyClientRanking(token);

          if (ignore) {
            return;
          }

          setTitle("Ranking semanal de clientes");
          setSubtitle(`Clientes que reciclaron en ${response.center.name} esta semana`);
          setPeriodLabel(formatPeriod(response.period.startAt, response.period.endAt));
          setRankingEntries(mapClientRanking(response));
          return;
        }

        const response = await getClientWeeklyRanking(token);

        if (ignore) {
          return;
        }

        setTitle("Ranking semanal de clientes");
        setSubtitle("Clientes con mayor reciclaje registrado durante la semana actual");
        setPeriodLabel(formatPeriod(response.period.startAt, response.period.endAt));
        setRankingEntries(mapClientRanking(response));
      } catch (loadError) {
        if (loadError instanceof ApiError && loadError.status === 401) {
          clearAccessToken();
          router.replace("/auth/login?next=%2Fgamification");
          return;
        }

        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudo cargar el ranking semanal",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadRanking();

    return () => {
      ignore = true;
    };
  }, [router, tokenPayload?.role]);

  const topThree = rankingEntries.slice(0, 3);
  const rest = rankingEntries.slice(3);
  const currentUserEntry = useMemo(
    () => rankingEntries.find((entry) => entry.isCurrentUser),
    [rankingEntries],
  );
  const showWalletLink = isClientRole(tokenPayload?.role);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-primary">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {error ? (
        <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" /> {title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          {periodLabel ? (
            <p className="text-xs text-muted-foreground mt-2">Semana: {periodLabel}</p>
          ) : null}
        </div>

        {showWalletLink ? (
          <Link
            href="/gamification/wallet"
            className="hidden sm:flex items-center gap-2 rounded-xl bg-primary/10 text-primary px-4 py-2 text-sm font-semibold hover:bg-primary/20 transition-colors"
          >
            💰 Billetera
          </Link>
        ) : null}
      </div>

      {topThree.length > 0 ? (
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {[1, 0, 2]
            .map((index) => topThree[index])
            .filter(Boolean)
            .map((entry) => {
              const Icon = podiumIcon[entry.rank - 1] ?? Award;
              const heightClass = entry.rank === 1 ? "h-36" : entry.rank === 2 ? "h-28" : "h-24";

              return (
                <div key={entry.id} className="flex flex-col items-center justify-end">
                  <div className="relative">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-primary-foreground font-bold mb-2 ring-2 ring-white shadow-lg"
                      style={{ background: "var(--gradient-primary)" }}
                    >
                      {entry.title
                        .split(" ")
                        .slice(0, 2)
                        .map((chunk) => chunk[0] ?? "")
                        .join("")
                        .toUpperCase()}
                    </div>
                    {entry.rank === 1 ? (
                      <span className="absolute -top-2 -right-1 text-lg">👑</span>
                    ) : null}
                  </div>
                  <p className="text-xs font-semibold text-foreground truncate max-w-full">
                    {entry.isCenter ? entry.title : entry.title.split(" ")[0]}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {entry.totalWeightKg.toFixed(1)} kg
                  </p>
                  <div
                    className={cn(
                      "w-full mt-2 rounded-t-xl bg-card border border-border border-b-0 flex flex-col items-center justify-center gap-1 px-2 text-center",
                      heightClass,
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-6 h-6",
                        entry.rank === 1 ? "text-amber-500" : "text-muted-foreground",
                      )}
                    />
                    <span className="text-2xl font-bold text-foreground">{entry.rank}</span>
                    <span className="text-[10px] text-muted-foreground">{entry.totalRecords} reciclajes</span>
                  </div>
                </div>
              );
            })}
        </div>
      ) : null}

      {rankingEntries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <Trophy className="w-10 h-10 text-primary mx-auto" />
          <h2 className="mt-4 text-lg font-bold text-foreground">Sin datos esta semana</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Aun no hay reciclajes registrados para construir el ranking semanal.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-card border border-border overflow-hidden">
          <ul className="divide-y divide-border">
            {rest.map((entry) => (
              <li
                key={entry.id}
                className={cn(
                  "flex items-center gap-3 p-4 transition-colors",
                  entry.isCurrentUser && "bg-primary/5",
                )}
              >
                <span className="w-7 text-center text-sm font-bold text-muted-foreground">
                  {entry.rank}
                </span>
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-sm font-semibold text-primary">
                  {entry.title
                    .split(" ")
                    .slice(0, 2)
                    .map((chunk) => chunk[0] ?? "")
                    .join("")
                    .toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {entry.title}{" "}
                    {entry.isCurrentUser ? (
                      <span className="text-[10px] text-primary font-bold">(tú)</span>
                    ) : null}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{entry.subtitle}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{entry.detail}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground inline-flex items-center gap-1 justify-end">
                    <Scale className="w-3.5 h-3.5 text-primary" />
                    {entry.totalWeightKg.toFixed(1)} kg
                  </p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 justify-end mt-1">
                    <Flame className="w-3 h-3" /> {entry.totalRecords} reciclajes
                  </p>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1 justify-end mt-1">
                    <Ticket className="w-3 h-3" /> {entry.totalPoints} pts
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {currentUserEntry ? (
        <div className="fixed bottom-16 lg:bottom-4 inset-x-0 lg:left-64 z-10 px-4">
          <div
            className="max-w-6xl mx-auto rounded-2xl p-4 flex items-center gap-3 text-primary-foreground shadow-xl"
            style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-eco)" }}
          >
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
              {currentUserEntry.rank}
            </span>
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
              {currentUserEntry.title
                .split(" ")
                .slice(0, 2)
                .map((chunk) => chunk[0] ?? "")
                .join("")
                .toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate">{currentUserEntry.title}</p>
              <p className="text-xs opacity-80">{currentUserEntry.detail}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold">{currentUserEntry.totalWeightKg.toFixed(1)} kg</p>
              <p className="text-[10px] opacity-80">{currentUserEntry.totalRecords} reciclajes</p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function mapClientRanking(
  response: WeeklyClientRankingResponse | ValidatorWeeklyClientRankingResponse,
): RankingViewModel[] {
  return response.ranking.map((entry) => ({
    id: entry.userId,
    rank: entry.rank,
    title: entry.name,
    subtitle: `${entry.validatedRecords} validados • ${entry.pendingRecords} pendientes`,
    detail: `${entry.totalPoints} pts generados esta semana`,
    totalWeightKg: entry.totalWeightKg,
    totalRecords: entry.totalRecords,
    totalPoints: entry.totalPoints,
    validatedRecords: entry.validatedRecords,
    pendingRecords: entry.pendingRecords,
    isCurrentUser: entry.isCurrentUser,
  }));
}

function mapCenterRanking(response: WeeklyCenterRankingResponse): RankingViewModel[] {
  return response.ranking.map((entry) => ({
    id: entry.centerId,
    rank: entry.rank,
    title: entry.name,
    subtitle: entry.district ? `${entry.district} • ${entry.address}` : entry.address,
    detail: `${entry.validatedRecords} validados • ${entry.pendingRecords} pendientes`,
    totalWeightKg: entry.totalWeightKg,
    totalRecords: entry.totalRecords,
    totalPoints: entry.totalPoints,
    validatedRecords: entry.validatedRecords,
    pendingRecords: entry.pendingRecords,
    isCenter: true,
  }));
}
