import { useState } from "react";
import { TabPerfil } from "./TabPerfil";
import { TabEmpresa } from "./TabEmpresa";
import { TabPersonal } from "./TabPersonal";
import { User, Building2, Users } from "lucide-react";

interface AjustesTabsProps {
  currentUser: any;
}

export function AjustesTabs({ currentUser }: AjustesTabsProps) {
  const [activeTab, setActiveTab] = useState("perfil");
  const isAdmin = currentUser.rol === 'ADMIN' || currentUser.rol === 'ROLE_ADMIN' || currentUser.rol === 'ROLE_SUPERADMIN';

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
        <button
          onClick={() => setActiveTab("perfil")}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "perfil" 
              ? "bg-primary text-[#0A0F0D] shadow-[0_0_15px_rgba(195,244,0,0.2)]" 
              : "text-text-muted hover:text-white hover:bg-[#111111]"
          }`}
        >
          <User className="w-5 h-5" />
          Mi Perfil
        </button>

        {isAdmin && (
          <>
            <button
              onClick={() => setActiveTab("empresa")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "empresa" 
                  ? "bg-primary text-[#0A0F0D] shadow-[0_0_15px_rgba(195,244,0,0.2)]" 
                  : "text-text-muted hover:text-white hover:bg-[#111111]"
              }`}
            >
              <Building2 className="w-5 h-5" />
              Gimnasio
            </button>
            <button
              onClick={() => setActiveTab("personal")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === "personal" 
                  ? "bg-primary text-[#0A0F0D] shadow-[0_0_15px_rgba(195,244,0,0.2)]" 
                  : "text-text-muted hover:text-white hover:bg-[#111111]"
              }`}
            >
              <Users className="w-5 h-5" />
              Gestión de Staff
            </button>
          </>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 w-full min-w-0 bg-[#121212] border border-[#1A1A1A] rounded-xl p-6 lg:p-8 min-h-[500px]">
        {activeTab === "perfil" && <TabPerfil currentUser={currentUser} />}
        {isAdmin && activeTab === "empresa" && <TabEmpresa />}
        {isAdmin && activeTab === "personal" && <TabPersonal />}
      </div>
    </div>
  );
}
