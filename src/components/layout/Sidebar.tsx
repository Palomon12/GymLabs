"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  LayoutDashboard,
  Users,
  CreditCard,
  BellRing,
  Settings,
  Plus,
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
    <aside className="w-[260px] bg-sidebar border-r border-border h-full flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-surface rounded-md flex items-center justify-center border border-border overflow-hidden">
             {/* Dummy Avatar/Logo */}
             <div className="w-full h-full bg-[url('https://i.pravatar.cc/150?img=11')] bg-cover bg-center" />
          </div>
          <div>
            <h1 className="text-primary font-bold tracking-wider text-xl leading-none">GYMLABS</h1>
            <p className="text-text-muted text-xs mt-1">Admin Console</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActiveStrict = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-sm text-sm font-medium transition-colors relative",
                  isActiveStrict
                    ? "bg-surface text-primary"
                    : "text-text-muted hover:text-text-main hover:bg-surface/50"
                )}
              >
                {isActiveStrict && (
                  <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary" />
                )}
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-border">
        <Link
          href="/ajustes"
          className="flex items-center gap-4 px-4 py-3 rounded-sm text-sm font-medium text-text-muted hover:text-text-main hover:bg-surface/50 transition-colors"
        >
          <Settings className="w-5 h-5" />
          Ajustes
        </Link>
      </div>
    </aside>
  );
}
