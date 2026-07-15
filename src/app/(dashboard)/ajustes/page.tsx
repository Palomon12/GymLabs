"use client";

import { useState } from "react";
import { UserAuth, mockAdmin, mockRecepcionista } from "@/types/auth";
import { AjustesTabs } from "@/components/ajustes/AjustesTabs";

export default function AjustesPage() {
  // Simulador temporal de sesión (Hasta que implementemos el JWT login real)
  const [currentUser, setCurrentUser] = useState<UserAuth>(mockAdmin);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Ajustes</h1>
          <p className="text-text-muted text-sm mt-1">
            Configura tu cuenta y las preferencias del sistema.
          </p>
        </div>

        {/* Simulador de Rol (Temporal) */}
        <div className="flex items-center gap-3 bg-[#1A1A1A] p-2 rounded-lg border border-[#2A2A2A]">
          <span className="text-xs text-text-muted font-mono uppercase tracking-wider">Modo Vista:</span>
          <select 
            className="bg-[#121212] text-white text-sm border border-[#333] rounded px-2 py-1 focus:outline-none focus:border-primary"
            value={currentUser.rol}
            onChange={(e) => {
              if (e.target.value === 'ADMIN') setCurrentUser(mockAdmin);
              else setCurrentUser(mockRecepcionista);
            }}
          >
            <option value="ADMIN">Administrador (Dueño)</option>
            <option value="RECEPCIONISTA">Recepcionista (Staff)</option>
          </select>
        </div>
      </div>

      <AjustesTabs currentUser={currentUser} />
    </div>
  );
}
