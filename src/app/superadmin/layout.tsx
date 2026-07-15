"use client";

import { TopNav } from "@/components/layout/TopNav";
import { LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { logout } = useAuth();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar minimalista para SaaS Admin */}
      <aside className="w-[80px] bg-surface border-r border-border/50 flex flex-col items-center py-8 justify-between fixed h-full z-50">
        <div className="w-10 h-10 bg-primary text-[#0A0F0D] flex items-center justify-center rounded-sm font-bold text-xl">
          G
        </div>
        
        <button onClick={logout} className="w-10 h-10 flex items-center justify-center rounded-sm hover:bg-white/5 text-text-muted hover:text-white transition-colors">
          <LogOut className="w-5 h-5" />
        </button>
      </aside>
      
      <div className="flex-1 ml-[80px] flex flex-col min-h-screen">
        <TopNav />
        <main className="flex-1 p-8 bg-background overflow-auto">
          <div className="max-w-[1200px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
