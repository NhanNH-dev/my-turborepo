"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";

type Props = {
  children: React.ReactNode;
};

export default function SessionProviderWrapper({ children }: Props) {
  if (typeof window === "undefined") {
    // Trả về children gốc khi đang prerender server-side
    return <>{children}</>;
  }

  return <SessionProvider>{children}</SessionProvider>;
}
