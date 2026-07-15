import { UserAuth } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Save, KeyRound } from "lucide-react";

export function TabPerfil({ currentUser }: { currentUser: UserAuth }) {
  const [formData, setFormData] = useState({
    nombre: currentUser.nombre,
    apellido: currentUser.apellido,
    correo: currentUser.correo,
  });

  const [passwordData, setPasswordData] = useState({
    actual: "",
    nueva: "",
    confirmar: ""
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Perfil guardado (Simulación)");
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.nueva !== passwordData.confirmar) {
      alert("Las contraseñas no coinciden");
      return;
    }
    alert("Contraseña actualizada (Simulación)");
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white">Información Personal</h2>
          <p className="text-sm text-text-muted">Actualiza tus datos básicos de perfil.</p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-5 max-w-lg">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Nombre</label>
              <input 
                type="text" 
                value={formData.nombre}
                onChange={e => setFormData({...formData, nombre: e.target.value})}
                className="w-full bg-[#1A1A1A] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Apellidos</label>
              <input 
                type="text" 
                value={formData.apellido}
                onChange={e => setFormData({...formData, apellido: e.target.value})}
                className="w-full bg-[#1A1A1A] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Correo Electrónico</label>
            <input 
              type="email" 
              value={formData.correo}
              onChange={e => setFormData({...formData, correo: e.target.value})}
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Rol en el Sistema</label>
            <input 
              type="text" 
              disabled
              value={currentUser.rol === 'ADMIN' ? 'Administrador' : 'Recepcionista'}
              className="w-full bg-[#1A1A1A]/50 border border-[#333]/50 rounded-md px-3 py-2 text-text-muted cursor-not-allowed"
            />
          </div>

          <Button type="submit" className="bg-primary text-[#121212] hover:bg-[#a6d600]">
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </form>
      </section>

      <div className="h-px bg-[#222] w-full" />

      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-primary" />
            Seguridad
          </h2>
          <p className="text-sm text-text-muted">Cambia tu contraseña de acceso.</p>
        </div>

        <form onSubmit={handleSavePassword} className="space-y-5 max-w-lg">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Contraseña Actual</label>
            <input 
              type="password" 
              value={passwordData.actual}
              onChange={e => setPasswordData({...passwordData, actual: e.target.value})}
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Nueva Contraseña</label>
            <input 
              type="password" 
              value={passwordData.nueva}
              onChange={e => setPasswordData({...passwordData, nueva: e.target.value})}
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Confirmar Nueva Contraseña</label>
            <input 
              type="password" 
              value={passwordData.confirmar}
              onChange={e => setPasswordData({...passwordData, confirmar: e.target.value})}
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          <Button type="submit" variant="secondary" className="border-[#333] hover:border-primary hover:text-primary">
            Actualizar Contraseña
          </Button>
        </form>
      </section>
    </div>
  );
}
