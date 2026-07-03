"use client";

import { Search, User, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export function TopNav() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-20 border-b border-border bg-background flex items-center justify-between px-8">
      <div className="flex-1 max-w-md">
        {/* Espacio reservado para título o breadcrumbs si se desean */}
      </div>

      <div className="flex items-center gap-6">
        <div className="text-xl font-bold text-primary tracking-wide">
          Elite Fitness
        </div>
        
        <div className="h-6 w-px bg-border" />
        
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-10 h-10 rounded-full border border-border bg-surface flex items-center justify-center hover:bg-border transition-colors text-text-muted hover:text-text-main focus:outline-none"
          >
            <User className="w-5 h-5" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-surface border border-border py-1 z-50">
              <Link 
                href="/login"
                className="flex items-center px-4 py-2 text-sm text-text-main hover:bg-[#2A3F36] hover:text-primary transition-colors"
                onClick={() => setIsDropdownOpen(false)}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Cerrar sesión
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
