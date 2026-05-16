"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getAccessToken } from "@/lib/api";

export function ProtectedAppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      const next = pathname ? `?next=${encodeURIComponent(pathname)}` : "";
      router.replace(`/auth/login${next}`);
      return;
    }

    setIsAuthorized(true);
  }, [pathname, router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-primary">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}
