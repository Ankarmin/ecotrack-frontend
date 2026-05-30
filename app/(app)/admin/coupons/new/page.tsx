"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AdminCouponForm } from "@/components/AdminCouponForm";
import { clearAccessToken, createAdminCoupon, getAccessToken } from "@/lib/api";

export default function NewAdminCouponPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <Link href="/admin/coupons" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Volver a cupones
      </Link>

      <AdminCouponForm
        title="Crear cupon"
        submitLabel="Guardar cupon"
        onSubmit={async (payload) => {
          const token = getAccessToken();

          if (!token) {
            clearAccessToken();
            router.replace("/auth/login?next=%2Fadmin%2Fcoupons%2Fnew");
            return;
          }

          try {
            await createAdminCoupon(token, payload);
            toast.success("Cupon creado correctamente.");
            router.push("/admin/coupons");
          } catch (submitError) {
            throw submitError instanceof Error
              ? submitError
              : new Error("No se pudo crear el cupon");
          }
        }}
      />
    </div>
  );
}
