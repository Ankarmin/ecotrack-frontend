"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { AdminCenterForm } from "@/components/AdminCenterForm";
import {
  ApiError,
  clearAccessToken,
  createAdminValidator,
  createAdminCenter,
  getAccessToken,
  getAdminValidators,
  type AdminValidatorOption,
} from "@/lib/api";

export default function NewAdminCenterPage() {
  const router = useRouter();
  const [validators, setValidators] = useState<AdminValidatorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadValidators = async () => {
      const token = getAccessToken();

      if (!token) {
        router.replace("/auth/login?next=%2Fadmin%2Fcenters%2Fnew");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getAdminValidators(token);

        if (!ignore) {
          setValidators(data);
        }
      } catch (loadError) {
        if (loadError instanceof ApiError && loadError.status === 401) {
          clearAccessToken();
          router.replace("/auth/login?next=%2Fadmin%2Fcenters%2Fnew");
          return;
        }

        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudieron cargar los validadores",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadValidators();

    return () => {
      ignore = true;
    };
  }, [router]);

  return (
    <div className="space-y-6">
      <Link href="/admin/centers" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
        <ArrowLeft className="w-4 h-4" />
        Volver a centros
      </Link>

      <AdminCenterForm
        title="Crear centro de acopio"
        submitLabel="Guardar centro"
        validators={validators}
        loading={loading}
        error={error}
        onCreateValidator={async (payload) => {
          const token = getAccessToken();

          if (!token) {
            clearAccessToken();
            router.replace("/auth/login?next=%2Fadmin%2Fcenters%2Fnew");
            throw new Error("Sesion no disponible");
          }

          const validator = await createAdminValidator(token, payload);
          setValidators((current) => [...current, validator]);
          toast.success("Validador creado y listo para asociar.");
          return validator;
        }}
        onSubmit={async (payload) => {
          const token = getAccessToken();

          if (!token) {
            clearAccessToken();
            router.replace("/auth/login?next=%2Fadmin%2Fcenters%2Fnew");
            return;
          }

          try {
            const center = await createAdminCenter(token, payload);
            toast.success("Centro creado correctamente.");
            router.push(`/admin/centers/${center.id}`);
          } catch (submitError) {
            throw submitError instanceof Error
              ? submitError
              : new Error("No se pudo crear el centro");
          }
        }}
      />
    </div>
  );
}
