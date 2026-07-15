import { UserAuth } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">Información Personal</h2>
          <p className="text-sm text-text-muted mt-1">Actualiza tus datos básicos de perfil.</p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-muted">Nombres</label>
              <Input 
                type="text" 
                value={formData.nombre}
                onChange={e => setFormData({...formData, nombre: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-muted">Apellidos</label>
              <Input 
                type="text" 
                value={formData.apellido}
                onChange={e => setFormData({...formData, apellido: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-muted">Correo Electrónico</label>
            <Input 
              type="email" 
              value={formData.correo}
              onChange={e => setFormData({...formData, correo: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-muted">Rol en el Sistema</label>
            <Input 
              type="text" 
              disabled
              value={currentUser.rol === 'ADMIN' ? 'Administrador' : 'Recepcionista'}
            />
          </div>

          <div className="pt-2">
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </form>
      </section>

      <div className="h-px bg-[#222] w-full" />

      <section>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-primary" />
            Seguridad
          </h2>
          <p className="text-sm text-text-muted mt-1">Cambia tu contraseña de acceso.</p>
        </div>

        <form onSubmit={handleSavePassword} className="space-y-6 max-w-2xl">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-muted">Contraseña Actual</label>
            <Input 
              type="password" 
              required
              value={passwordData.actual}
              onChange={e => setPasswordData({...passwordData, actual: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-muted">Nueva Contraseña</label>
              <Input 
                type="password" 
                required
                value={passwordData.nueva}
                onChange={e => setPasswordData({...passwordData, nueva: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-muted">Confirmar Nueva Contraseña</label>
              <Input 
                type="password" 
                required
                value={passwordData.confirmar}
                onChange={e => setPasswordData({...passwordData, confirmar: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="secondary">
              Actualizar Contraseña
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
