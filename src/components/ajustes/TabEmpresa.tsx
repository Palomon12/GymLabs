import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, UploadCloud } from "lucide-react";

export function TabEmpresa() {
  const [formData, setFormData] = useState({
    nombre: "GymLabs Elite Fitness",
    direccion: "Av. Principal 123, Ciudad",
    telefono: "+51 987 654 321",
    correoContacto: "contacto@gymlabs.com",
    moneda: "S/"
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Ajustes de empresa guardados (Simulación)");
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <div className="mb-6 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-white">Configuración del Gimnasio</h2>
            <p className="text-sm text-text-muted">Administra los detalles de tu empresa.</p>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="w-20 h-20 bg-background border border-[#333] rounded-lg flex items-center justify-center font-bold text-primary text-xl">
              GL
            </div>
            <button className="text-xs text-text-muted hover:text-primary flex items-center gap-1 transition-colors">
              <UploadCloud className="w-3 h-3" />
              Cambiar Logo
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-5 max-w-2xl">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Nombre Comercial</label>
            <input 
              type="text" 
              value={formData.nombre}
              onChange={e => setFormData({...formData, nombre: e.target.value})}
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Moneda</label>
              <select 
                value={formData.moneda}
                onChange={e => setFormData({...formData, moneda: e.target.value})}
                className="w-full bg-[#1A1A1A] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
              >
                <option value="S/">Soles (S/)</option>
              </select>
              <p className="text-[10px] text-text-muted">Fijo en Soles según configuración global.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Teléfono Público</label>
              <input 
                type="text" 
                value={formData.telefono}
                onChange={e => setFormData({...formData, telefono: e.target.value})}
                className="w-full bg-[#1A1A1A] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Dirección del Local</label>
            <input 
              type="text" 
              value={formData.direccion}
              onChange={e => setFormData({...formData, direccion: e.target.value})}
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Correo Público (Contacto)</label>
            <input 
              type="email" 
              value={formData.correoContacto}
              onChange={e => setFormData({...formData, correoContacto: e.target.value})}
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <Button type="submit" className="bg-primary text-[#121212] hover:bg-[#a6d600] mt-4">
            <Save className="w-4 h-4 mr-2" />
            Guardar Configuración
          </Button>
        </form>
      </section>
    </div>
  );
}
