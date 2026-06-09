"use client";

import { Search, Bell, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

export function TopNav() {
  return (
    <header className="h-20 border-b border-border bg-background flex items-center justify-between px-8">
      <div className="flex-1 max-w-md">
        {/* Espacio reservado para título o breadcrumbs si se desean */}
      </div>

      <div className="flex items-center gap-6">
        <div className="text-sm font-medium text-text-muted">
          Elite Fitness
        </div>
        
        <div className="h-6 w-px bg-border" />
        
        <div className="flex items-center gap-4 text-text-muted">
          <button className="hover:text-text-main transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="hover:text-text-main transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="w-9 h-9 rounded-full border border-border bg-surface flex items-center justify-center overflow-hidden">
          <div className="w-full h-full bg-[url('https://i.pravatar.cc/150?img=11')] bg-cover bg-center" />
        </div>
      </div>
    </header>
  );
}
