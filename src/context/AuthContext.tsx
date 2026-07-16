"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthUser {
  token: string;
  nombre: string;
  rol: string;
  idEmpresa?: number;
  empresaNombre?: string;
  apellido?: string;
  correo?: string;
  idPersonal?: number;
  dni?: string;
  telefono?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (userData: AuthUser) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem("gymlabs_auth");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (userData: AuthUser) => {
    setUser(userData);
    localStorage.setItem("gymlabs_auth", JSON.stringify(userData));
    if (userData.rol === "ROLE_SUPERADMIN") {
      router.push("/superadmin");
    } else {
      router.push("/dashboard");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("gymlabs_auth");
    router.push("/login");
  };

  // Protect routes based on authentication
  useEffect(() => {
    if (!isLoading) {
      if (!user && pathname !== "/login") {
        router.push("/login");
      } else if (user && pathname === "/login") {
        if (user.rol === "ROLE_SUPERADMIN") {
          router.push("/superadmin");
        } else {
          router.push("/dashboard");
        }
      } else if (user && pathname.startsWith("/superadmin") && user.rol !== "ROLE_SUPERADMIN") {
        router.push("/dashboard");
      }
    }
  }, [user, isLoading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {isLoading ? (
        <div className="flex min-h-screen items-center justify-center bg-background text-primary">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
