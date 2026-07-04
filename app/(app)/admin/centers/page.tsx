"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  ChevronRight,
  Loader2,
  MapPin,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import {
  ApiError,
  clearAccessToken,
  deactivateAdminCenter,
  getAccessToken,
  getAdminCenters,
  type AdminCenter,
} from "@/lib/api";

export default function AdminCentersPage() {
  const router = useRouter();
  const [centers, setCenters] = useState<AdminCenter[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const loadCenters = async () => {
      const token = getAccessToken();

      if (!token) {
        router.replace("/auth/login?next=%2Fadmin%2Fcenters");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getAdminCenters(token);

        if (!ignore) {
          setCenters(data);
        }
      } catch (loadError) {
        if (loadError instanceof ApiError && loadError.status === 401) {
          clearAccessToken();
          router.replace("/auth/login?next=%2Fadmin%2Fcenters");
          return;
        }

        if (!ignore) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "No se pudieron cargar los centros de acopio",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadCenters();

    return () => {
      ignore = true;
    };
  }, [router]);

  const filteredCenters = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) {
      return centers;
    }

    return centers.filter((center) =>
      [center.name, center.address, center.district ?? "", center.operationalStatus]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [centers, search]);

  const handleDeactivate = async (centerId: string) => {
    const token = getAccessToken();

    if (!token) {
      clearAccessToken();
      router.replace("/auth/login?next=%2Fadmin%2Fcenters");
      return;
    }

    const confirmed = window.confirm("¿Deseas desactivar este centro de acopio?");

    if (!confirmed) {
      return;
    }

    try {
      const updatedCenter = await deactivateAdminCenter(token, centerId);
      setCenters((current) =>
        current.map((center) => (center.id === centerId ? updatedCenter : center)),
      );
      toast.success("Centro desactivado correctamente.");
    } catch (deactivateError) {
      setError(
        deactivateError instanceof Error
          ? deactivateError.message
          : "No se pudo desactivar el centro",
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
          <h1 className="text-2xl font-bold text-foreground">Centros de acopio</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gestiona información, validadores y avance operativo por centro.
          </p>
        </div>

        <Link
          href="/admin/centers/new"
          className="rounded-xl py-3 px-4 font-semibold text-primary-foreground inline-flex items-center gap-2 justify-center"
          style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-eco)" }}
        >
          <Plus className="w-4 h-4" />
          Nuevo centro
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
          placeholder="Buscar centros por nombre, dirección o estado"
          className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-3 text-sm outline-none transition-colors focus:border-primary"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredCenters.map((center) => (
          <div key={center.id} className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <h2 className="font-bold text-foreground">{center.name}</h2>
                </div>
                <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {center.address}
                </p>
              </div>
              <span className="text-xs rounded-full px-2.5 py-1 bg-primary/10 text-primary font-medium">
                {center.operationalStatus}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl border border-border bg-background p-3">
                <p className="text-[10px] text-muted-foreground">Pendientes</p>
                <p className="font-bold text-foreground">{center.stats.pendingRecords}</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-3">
                <p className="text-[10px] text-muted-foreground">Validados</p>
                <p className="font-bold text-primary">{center.stats.validatedRecords}</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-3">
                <p className="text-[10px] text-muted-foreground">Peso</p>
                <p className="font-bold text-foreground">{center.stats.totalWeightKg.toFixed(1)} kg</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-background px-4 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <Users className="w-4 h-4 text-primary" />
                <span className="font-medium">Validadores asociados</span>
              </div>
              <span className="text-sm font-semibold text-primary">
                {center.validators.length}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3">
              <Link
                href={`/admin/centers/${center.id}`}
                className="text-sm font-semibold text-primary inline-flex items-center gap-1 hover:underline"
              >
                Ver detalle <ChevronRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/centers/${center.id}/edit#validators-asociados`}
                  className="rounded-lg border border-primary/20 px-3 py-2 text-sm text-primary hover:bg-primary/5 transition-colors inline-flex items-center gap-2"
                >
                  <Users className="w-4 h-4" />
                  Validadores
                </Link>
                <Link
                  href={`/admin/centers/${center.id}/edit`}
                  className="rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:border-primary/40 transition-colors"
                >
                  Editar
                </Link>
                {center.isActive ? (
                  <button
                    type="button"
                    onClick={() => {
                      void handleDeactivate(center.id);
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
