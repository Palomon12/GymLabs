"use client";

import { useAuth } from "@/context/AuthContext";
import { UserAuth } from "@/types/auth";
import { AjustesTabs } from "@/components/ajustes/AjustesTabs";

export default function AjustesPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Ajustes</h1>
          <p className="text-text-muted text-sm mt-1">
            Configura tu cuenta y las preferencias del sistema.
          </p>
        </div>
      </div>

      <AjustesTabs currentUser={user} />
    </div>
  );
}
