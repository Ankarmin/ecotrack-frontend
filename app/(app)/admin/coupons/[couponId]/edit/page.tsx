"use client";

import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminCouponForm } from "@/components/AdminCouponForm";
import {
  ApiError,
  clearAccessToken,
  getAccessToken,
  getAdminCoupon,
  updateAdminCoupon,
  type AdminCoupon,
} from "@/lib/api";

export default function EditAdminCouponPage() {
  const params = useParams<{ couponId: string }>();
  const router = useRouter();
  const [coupon, setCoupon] = useState<AdminCoupon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadCoupon = async () => {
      const token = getAccessToken();

      if (!token) {
        router.replace(`/auth/login?next=%2Fadmin%2Fcoupons%2F${params.couponId}%2Fedit`);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getAdminCoupon(token, params.couponId);

        if (!ignore) {
          setCoupon(data);
        }
      } catch (loadError) {
        if (loadError instanceof ApiError && loadError.status === 401) {
          clearAccessToken();
          router.replace(`/auth/login?next=%2Fadmin%2Fcoupons%2F${params.couponId}%2Fedit`);
          return;
        }

        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudo cargar el cupon",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadCoupon();

    return () => {
      ignore = true;
    };
  }, [params.couponId, router]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-primary">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!coupon) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Link href="/admin/coupons" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Volver a cupones
      </Link>

      <AdminCouponForm
        title={`Editar ${coupon.title}`}
        submitLabel="Guardar cambios"
        initialCoupon={coupon}
        error={error}
        onSubmit={async (payload) => {
          const token = getAccessToken();

          if (!token) {
            clearAccessToken();
            router.replace(`/auth/login?next=%2Fadmin%2Fcoupons%2F${params.couponId}%2Fedit`);
            return;
          }

          try {
            await updateAdminCoupon(token, coupon.id, payload);
            toast.success("Cupon actualizado correctamente.");
            router.push("/admin/coupons");
          } catch (submitError) {
            throw submitError instanceof Error
              ? submitError
              : new Error("No se pudo actualizar el cupon");
          }
        }}
      />
    </div>
  );
}
