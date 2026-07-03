import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Mail, Lock, Eye, ArrowRight } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-[#0A0F0D] text-text-main overflow-hidden">
      {/* Left Panel: Graphic & Boldness */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-end p-16">
        {/* Dark Gym Background Image */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Overlay Gradients */}
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0F1A15] via-[#0F1A15]/80 to-transparent" />
        <div className="absolute inset-0 z-10 bg-primary/10 mix-blend-overlay" />
        
        {/* Text Content */}
        <div className="relative z-20 max-w-xl">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-1 bg-primary" />
            <span className="text-primary font-mono tracking-[0.2em] text-sm font-bold uppercase">Josué 1:9</span>
          </div>
          <h1 className="text-6xl xl:text-7xl font-bold tracking-tighter leading-[0.9] text-white mb-6 uppercase">
            Esfuérzate <br /> 
            <span className="text-text-muted">y sé</span> <br /> 
            Valiente
          </h1>
          <p className="text-text-muted font-mono text-sm leading-relaxed border-l border-primary/30 pl-4">
            No temas ni desmayes, porque el Señor tu Dios <br className="hidden xl:block" />
            estará contigo en dondequiera que vayas.
          </p>
        </div>
      </div>

      {/* Right Panel: Precision Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-surface relative">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Acceso al Sistema</h2>
            <p className="text-text-muted font-mono text-sm">Autenticación requerida para administradores.</p>
          </div>

          <form className="space-y-8">
            <div className="space-y-3 group">
              <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono group-focus-within:text-primary transition-colors">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email"
                  placeholder="admin@gimnasio.com" 
                  className="w-full bg-transparent border-b-2 border-border focus:border-primary outline-none py-2 pl-10 pr-4 text-white font-mono placeholder:text-text-muted/50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-3 group">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono group-focus-within:text-primary transition-colors">
                  Contraseña
                </label>
              </div>
              <div className="relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type="password"
                  placeholder="••••••••" 
                  className="w-full bg-transparent border-b-2 border-border focus:border-primary outline-none py-2 pl-10 pr-10 text-white font-mono placeholder:text-text-muted/50 transition-colors"
                />
                <button type="button" className="absolute right-0 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/" className="w-full block">
                <Button type="button" className="w-full h-14 bg-primary text-[#0F1A15] hover:bg-primary-hover font-bold text-sm tracking-wider flex items-center justify-between px-6 rounded-none group transition-all">
                  <span>AUTORIZAR ACCESO</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </form>

          <div className="mt-16 pt-8 border-t border-border flex justify-between items-center text-xs font-mono text-text-muted">
            <span>GYMLABS © 2026</span>
            <a href="#" className="hover:text-primary transition-colors">Soporte Técnico</a>
          </div>
        </div>
      </div>
    </div>
  );
}
