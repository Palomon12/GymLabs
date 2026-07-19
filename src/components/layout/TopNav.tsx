"use client";

import { useAuth } from "@/context/AuthContext";

export function TopNav() {
  const { user } = useAuth();
  
  return (
    <header className="h-20 bg-background/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
      <div className="flex-1 max-w-md">
        {/* Espacio reservado para título o breadcrumbs si se desean */}
      </div>

      <div className="flex items-center gap-6">
        <div className="text-xl font-bold text-white tracking-widest uppercase">
          {user?.rol === 'ROLE_SUPERADMIN' ? (
            <>
              GYM<span className="text-primary">LABS</span>
            </>
          ) : user?.empresaNombre ? (
            <>
              {user.empresaNombre.substring(0, Math.floor(user.empresaNombre.length / 2))}
              <span className="text-primary">{user.empresaNombre.substring(Math.floor(user.empresaNombre.length / 2))}</span>
            </>
          ) : (
            <>
              GYM<span className="text-primary">LABS</span>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
