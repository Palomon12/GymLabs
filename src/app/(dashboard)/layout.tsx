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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user || user.rol === "ROLE_SUPERADMIN") {
        router.push(user?.rol === "ROLE_SUPERADMIN" ? "/superadmin" : "/login");
      } else {
        // Restricción de rutas para RECEPCIONISTA
        const isRecepcionista = user.rol === 'ROLE_RECEPCIONISTA' || user.rol === 'RECEPCIONISTA';
        if (isRecepcionista && pathname === '/dashboard') {
          router.push('/');
        } else {
          setIsAuthorized(true);
        }
      }
    }
  }, [user, isLoading, router, pathname]);

  if (!isAuthorized) return null;

  return (
    <div className="flex min-h-screen relative">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-[260px] fixed h-full z-50">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="w-[260px] relative flex-shrink-0 bg-black shadow-xl">
            <Sidebar onNavigate={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-[260px] flex flex-col min-h-screen w-full transition-all duration-300">
        <TopNav onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-4 md:p-8 bg-background overflow-x-hidden">
          <div className="max-w-[1440px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
