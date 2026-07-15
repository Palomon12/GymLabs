"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User, Lock, Eye, EyeOff, ArrowRight, Activity, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/config/api";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({ username: "", password: "" });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: formData.username, password: formData.password })
      });

      if (!response.ok) {
        throw new Error("Credenciales inválidas");
      }

      const data = await response.json();
      login(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid h-screen w-full lg:grid-cols-2 bg-background text-text-main overflow-hidden font-sans">
      
      {/* Left Panel: Bold Brand Presence */}
      <div className="hidden lg:flex relative flex-col justify-between p-12 xl:p-24 overflow-hidden group">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-[20s] group-hover:scale-110"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')",
          }}
        />
        <div className="absolute inset-0 z-10 bg-[#0A0F0D]/90" />
        <div className="absolute inset-0 z-10 bg-gradient-to-tr from-primary/10 to-transparent mix-blend-overlay" />
        
        <div className="relative z-20 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary text-[#0A0F0D] flex items-center justify-center rounded-sm">
            <Activity className="w-6 h-6" />
          </div>
          <span className="font-bold tracking-widest text-lg uppercase text-white">GYMLABS</span>
        </div>

        <div className="relative z-20 w-[90%] max-w-[600px]">
          <div className="mb-8">
            <div className="inline-flex items-center gap-4 bg-[#16241F]/80 backdrop-blur-sm border border-primary/20 px-4 py-2 rounded-full">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary font-mono tracking-[0.2em] text-xs font-bold uppercase">Josué 1:9</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tighter leading-[1.05] text-white mb-8 uppercase">
            Esfuérzate y sé <span className="text-primary">Valiente</span>
          </h1>
          
          <div className="border-l-4 border-primary pl-6 py-2 bg-gradient-to-r from-primary/5 to-transparent">
            <p className="text-text-muted font-mono text-sm leading-relaxed max-w-[450px]">
              No temas ni desmayes, porque el Señor tu Dios estará contigo en dondequiera que vayas.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel: Functional Form */}
      <div className="flex w-full flex-col justify-center items-center p-8 sm:p-12 lg:p-24 bg-surface relative z-10 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
        
        <div className="w-full max-w-[440px] flex flex-col justify-center h-full">
          
          <div className="mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-white mb-4">Acceso Autorizado</h2>
            <p className="text-text-muted font-mono text-sm leading-relaxed">
              Consola de administración operativa. Ingrese sus credenciales para continuar.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-8">
            
            {/* Username Field */}
            <div className="space-y-4 group">
              <label className="text-xs font-bold text-text-muted tracking-widest uppercase font-mono group-focus-within:text-primary transition-colors flex items-center gap-2">
                <User className="w-4 h-4" /> Usuario
              </label>
              <div className="relative">
                <input 
                  type="email"
                  placeholder="ejemplo@correo.com"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={isLoading}
                  className="w-full bg-[#0A0F0D] border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none px-5 py-4 text-white font-mono placeholder:text-text-muted/30 transition-all rounded-md"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-4 group">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-text-muted tracking-widest uppercase font-mono group-focus-within:text-primary transition-colors flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Contraseña
                </label>
              </div>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  disabled={isLoading}
                  className="w-full bg-[#0A0F0D] border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none px-5 py-4 pr-12 text-white font-mono placeholder:text-text-muted/30 transition-all rounded-md"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  id="password-input"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="text-alert text-sm font-bold bg-alert/10 p-3 rounded-md border border-alert/20 text-center">
                {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-16 bg-primary text-[#0A0F0D] hover:bg-primary-hover disabled:bg-primary/50 disabled:cursor-not-allowed font-bold text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-4 rounded-md group transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Ingresar al Panel</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-auto pt-16 border-t border-border/50 flex justify-between items-center text-xs font-mono text-text-muted">
            <span>GYMLABS © 2026</span>
            <a href="#" className="hover:text-primary transition-colors">Centro de Soporte</a>
          </div>
          
        </div>
      </div>
    </div>
  );
}
