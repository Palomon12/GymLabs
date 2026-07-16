"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { TopNav } from "@/components/layout/TopNav";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.rol === "ROLE_SUPERADMIN") {
        router.push(user?.rol === "ROLE_SUPERADMIN" ? "/superadmin" : "/login");
      } else {
        // Restricción de rutas para RECEPCIONISTA
        const isRecepcionista = user.rol === 'ROLE_RECEPCIONISTA' || user.rol === 'RECEPCIONISTA';
        if (isRecepcionista && (pathname === '/dashboard' || pathname === '/planes')) {
          router.push('/');
        } else {
          setIsAuthorized(true);
        }
      }
    }
  }, [user, isLoading, router, pathname]);

  if (!isAuthorized) return null;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
        <TopNav />
        <main className="flex-1 p-8 bg-background overflow-auto">
          <div className="max-w-[1440px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
