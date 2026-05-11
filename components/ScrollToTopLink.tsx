"use client";

import Link from "next/link";
import { ReactNode } from "react";

export function ScrollToTopLink({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href="/"
      onClick={(e) => {
        if (window.location.pathname === "/") {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }}
      className={className}
    >
      {children}
    </Link>
  );
}
