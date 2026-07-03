import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Building2, Mail, Lock, Eye } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0d0d0d] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-surface border border-border rounded-md shadow-2xl relative z-10 overflow-hidden">
        {/* Top active border */}
        <div className="h-1 w-full bg-primary" />
        
        <div className="p-10 flex flex-col items-center">
          <h1 className="text-primary font-bold tracking-wider text-4xl leading-none mb-2">GYMLABS</h1>
          <p className="text-text-muted text-sm mb-10">Admin Console Access</p>

          <form className="w-full space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-main tracking-widest uppercase font-mono">
                Empresa / Gimnasio
              </label>
              <Input 
                placeholder="Nombre de tu centro" 
                icon={<Building2 className="w-4 h-4" />}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-text-main tracking-widest uppercase font-mono">
                Email
              </label>
              <Input 
                type="email"
                placeholder="admin@gimnasio.com" 
                icon={<Mail className="w-4 h-4" />}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-text-main tracking-widest uppercase font-mono">
                  Contraseña
                </label>
                <a href="#" className="text-xs text-primary hover:underline font-semibold">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div className="relative">
                <Input 
                  type="password"
                  placeholder="••••••••" 
                  icon={<Lock className="w-4 h-4" />}
                />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            <Link href="/" className="w-full block mt-4">
              <Button type="button" className="w-full h-12 text-sm">
                INICIAR SESIÓN →
              </Button>
            </Link>
          </form>

          <div className="w-full h-px bg-border my-8" />

          <p className="text-xs text-text-muted">
            ¿Necesitas ayuda? <a href="#" className="text-primary hover:underline">Soporte Técnico</a>
          </p>
        </div>
      </div>
    </div>
  );
}
