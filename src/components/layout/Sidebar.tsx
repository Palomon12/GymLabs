"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  LayoutDashboard,
  Users,
  CreditCard,
  BellRing,
  Settings,
  Plus,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/", label: "Inicio", icon: Users },
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/planes", label: "Planes", icon: CreditCard },
  { href: "/alertas", label: "Alertas", icon: BellRing },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] bg-black border-r border-[#111111] h-full flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8">
        {/* Typographic Logo */}
        <div className="flex items-center gap-3 mb-12">
          <div>
            <h1 className="text-white font-bold tracking-widest text-xl leading-none uppercase">GYMLABS</h1>
            <p className="text-primary font-mono text-[10px] mt-1 tracking-widest uppercase opacity-80">Software</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActiveStrict = pathname === item.href;
            
            const activeClasses = isActiveStrict 
              ? "text-[#0A0F0D] bg-primary shadow-[0_0_15px_rgba(195,244,0,0.2)]" 
              : "text-text-muted hover:text-white hover:bg-[#111111]";
              
            const iconActiveClasses = isActiveStrict ? "text-[#0A0F0D]" : "group-hover:text-primary transition-colors";

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-semibold transition-all relative overflow-hidden group ${activeClasses}`}
              >
                {isActiveStrict && (
                  <span className="absolute inset-0 bg-white/20 mix-blend-overlay" />
                )}
                <item.icon className={`w-5 h-5 ${iconActiveClasses}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-[#111111] flex flex-col gap-2">
        <Link
          href="/ajustes"
          className={`flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-semibold transition-all group ${pathname === "/ajustes" ? "bg-primary text-[#0A0F0D] shadow-[0_0_15px_rgba(195,244,0,0.2)]" : "text-text-muted hover:text-white hover:bg-[#111111]"}`}
        >
          <Settings className={`w-5 h-5 transition-transform duration-500 ${pathname !== "/ajustes" ? "group-hover:rotate-90" : ""}`} />
          Ajustes
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-semibold text-alert hover:text-white hover:bg-alert/20 transition-all group mt-2"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Cerrar Sesión
        </Link>
      </div>
    </aside>
  );
}
