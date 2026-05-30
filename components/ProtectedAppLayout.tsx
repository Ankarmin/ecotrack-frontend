"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useSyncExternalStore } from "react";
import { AppLayout } from "@/components/AppLayout";
import {
  ACCESS_TOKEN_KEY,
  getAccessToken,
  getAccessTokenPayload,
  isAdminRole,
  isClientRole,
  isValidatorRole,
} from "@/lib/api";

export function ProtectedAppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const subscribe = useCallback((onStoreChange: () => void) => {
    if (typeof window === "undefined") {
      return () => {};
    }

    const handleStorage = (event: StorageEvent) => {
      if (event.key === ACCESS_TOKEN_KEY) {
        onStoreChange();
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);
  const token = useSyncExternalStore(subscribe, getAccessToken, () => null);
  const tokenPayload = getAccessTokenPayload();
  const adminOnlyRoute = pathname?.startsWith("/admin") ?? false;
  const walletOnlyRoute = pathname?.startsWith("/gamification/wallet") ?? false;
  const validatorOnlyRoute = pathname?.startsWith("/collection-center") ?? false;
  const adminBlocked = adminOnlyRoute && tokenPayload ? !isAdminRole(tokenPayload.role) : false;
  const walletBlocked = walletOnlyRoute && tokenPayload ? !isClientRole(tokenPayload.role) : false;
  const validatorBlocked =
    validatorOnlyRoute && tokenPayload ? !isValidatorRole(tokenPayload.role) : false;

  useEffect(() => {
    if (token) {
      if (adminBlocked) {
        router.replace("/dashboard");
      }

      if (validatorBlocked) {
        router.replace("/dashboard");
      }

      if (walletBlocked) {
        router.replace("/dashboard");
      }

      return;
    }

    const next = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
    router.replace(`/auth/login${next}`);
  }, [adminBlocked, pathname, router, token, validatorBlocked, walletBlocked]);

  if (!token || adminBlocked || validatorBlocked || walletBlocked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}
