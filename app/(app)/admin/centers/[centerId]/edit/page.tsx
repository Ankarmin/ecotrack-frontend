"use client";

import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminCenterForm } from "@/components/AdminCenterForm";
import {
  ApiError,
  clearAccessToken,
  createAdminValidator,
  getAccessToken,
  getAdminCenter,
  getAdminValidators,
  updateAdminCenter,
  type AdminCenter,
  type AdminValidatorOption,
} from "@/lib/api";

export default function EditAdminCenterPage() {
  const params = useParams<{ centerId: string }>();
  const router = useRouter();
  const [center, setCenter] = useState<AdminCenter | null>(null);
  const [validators, setValidators] = useState<AdminValidatorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadData = async () => {
      const token = getAccessToken();

      if (!token) {
        router.replace(`/auth/login?next=%2Fadmin%2Fcenters%2F${params.centerId}%2Fedit`);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const [centerData, validatorsData] = await Promise.all([
          getAdminCenter(token, params.centerId),
          getAdminValidators(token),
        ]);

        if (!ignore) {
          setCenter(centerData);
          setValidators(validatorsData);
        }
      } catch (loadError) {
        if (loadError instanceof ApiError && loadError.status === 401) {
          clearAccessToken();
          router.replace(`/auth/login?next=%2Fadmin%2Fcenters%2F${params.centerId}%2Fedit`);
          return;
        }

        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudo cargar la configuracion del centro",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      ignore = true;
    };
  }, [params.centerId, router]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-primary">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!center) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Link href={`/admin/centers/${center.id}`} className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Volver al detalle
      </Link>

      <AdminCenterForm
        title={`Editar ${center.name}`}
        submitLabel="Guardar cambios"
        validators={validators}
        initialCenter={center}
        error={error}
        onCreateValidator={async (payload) => {
          const token = getAccessToken();

          if (!token) {
            clearAccessToken();
            router.replace(`/auth/login?next=%2Fadmin%2Fcenters%2F${params.centerId}%2Fedit`);
            throw new Error("Sesion no disponible");
          }

          const validator = await createAdminValidator(token, payload);
          setValidators((current) => [...current, validator]);
          toast.success("Validador creado y disponible para asociar.");
          return validator;
        }}
        onSubmit={async (payload) => {
          const token = getAccessToken();

          if (!token) {
            clearAccessToken();
            router.replace(`/auth/login?next=%2Fadmin%2Fcenters%2F${params.centerId}%2Fedit`);
            return;
          }

          try {
            const updatedCenter = await updateAdminCenter(token, center.id, payload);
            toast.success("Centro actualizado correctamente.");
            router.push(`/admin/centers/${updatedCenter.id}`);
          } catch (submitError) {
            throw submitError instanceof Error
              ? submitError
              : new Error("No se pudo actualizar el centro");
          }
        }}
      />
    </div>
  );
}
