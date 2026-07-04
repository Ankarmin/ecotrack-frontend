"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Gift,
  Loader2,
  Plus,
  Search,
  Ticket,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

import {
  ApiError,
  clearAccessToken,
  deactivateAdminCoupon,
  getAccessToken,
  getAdminCoupons,
  type AdminCoupon,
} from "@/lib/api";

export default function AdminCouponsPage() {
  const router = useRouter();
  const [coupons, setCoupons] = useState<AdminCoupon[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadCoupons = async () => {
      const token = getAccessToken();

      if (!token) {
        router.replace("/auth/login?next=%2Fadmin%2Fcoupons");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getAdminCoupons(token);

        if (!ignore) {
          setCoupons(data);
        }
      } catch (loadError) {
        if (loadError instanceof ApiError && loadError.status === 401) {
          clearAccessToken();
          router.replace("/auth/login?next=%2Fadmin%2Fcoupons");
          return;
        }

        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudieron cargar los cupones",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadCoupons();

    return () => {
      ignore = true;
    };
  }, [router]);

  const filteredCoupons = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) {
      return coupons;
    }

    return coupons.filter((coupon) =>
      [coupon.title, coupon.description ?? "", coupon.status]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [coupons, search]);

  const handleDeactivate = async (couponId: string) => {
    const token = getAccessToken();

    if (!token) {
      clearAccessToken();
      router.replace("/auth/login?next=%2Fadmin%2Fcoupons");
      return;
    }

    const confirmed = window.confirm("¿Deseas desactivar este cupon?");

    if (!confirmed) {
      return;
    }

    try {
      const updatedCoupon = await deactivateAdminCoupon(token, couponId);
      setCoupons((current) =>
        current.map((coupon) => (coupon.id === couponId ? updatedCoupon : coupon)),
      );
      toast.success("Cupon desactivado correctamente.");
    } catch (deactivateError) {
      setError(
        deactivateError instanceof Error
          ? deactivateError.message
          : "No se pudo desactivar el cupon",
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-primary">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Cupones</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona beneficios, stock, vigencia y estado de canje.
          </p>
        </div>

        <Link
          href="/admin/coupons/new"
          className="rounded-xl py-3 px-4 font-semibold text-primary-foreground inline-flex items-center gap-2 justify-center"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-eco)" }}
        >
          <Plus className="w-4 h-4" />
          Nuevo cupon
        </Link>
      </div>

      {error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="relative">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por titulo, descripcion o estado"
          className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-sm outline-none transition-colors focus:border-primary"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredCoupons.map((coupon) => (
          <div key={coupon.id} className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-primary" />
                  <h2 className="font-bold text-foreground">{coupon.title}</h2>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {coupon.description ?? "Sin descripcion"}
                </p>
              </div>
              <span className="text-xs rounded-full px-2.5 py-1 bg-primary/10 text-primary font-medium">
                {coupon.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl border border-border bg-background p-3">
                <p className="text-[10px] text-muted-foreground">Puntos</p>
                <p className="font-bold text-foreground">{coupon.requiredPoints}</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-3">
                <p className="text-[10px] text-muted-foreground">Stock</p>
                <p className="font-bold text-foreground">{coupon.stock}</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-3">
                <p className="text-[10px] text-muted-foreground">Canjes</p>
                <p className="font-bold text-primary">{coupon.stats.totalRedemptions}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="text-xs text-muted-foreground inline-flex items-center gap-2">
                <Ticket className="w-4 h-4" />
                Vigencia {coupon.validityDays} días
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/coupons/${coupon.id}/edit`}
                  className="rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:border-primary/40 transition-colors"
                >
                  Editar
                </Link>
                {coupon.isActive ? (
                  <button
                    type="button"
                    onClick={() => {
                      void handleDeactivate(coupon.id);
                    }}
                    className="rounded-lg border border-destructive/30 px-3 py-2 text-sm text-destructive hover:bg-destructive/5 transition-colors inline-flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Desactivar
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
