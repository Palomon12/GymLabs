import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <section>
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start gap-6">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Configuración del Gimnasio</h2>
            <p className="text-sm text-text-muted mt-1">Administra los detalles públicos de tu empresa.</p>
          </div>
          
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="w-24 h-24 bg-[#1A1A1A] border border-[#333] rounded-xl flex items-center justify-center font-bold text-primary text-2xl shadow-lg">
              GL
            </div>
            <button className="text-xs font-semibold text-text-muted hover:text-primary flex items-center gap-1.5 transition-colors bg-[#222] px-3 py-1.5 rounded-full hover:bg-[#333]">
              <UploadCloud className="w-3.5 h-3.5" />
              Cambiar Logo
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-muted">Nombre Comercial</label>
            <Input 
              type="text" 
              value={formData.nombre}
              onChange={e => setFormData({...formData, nombre: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-muted">Moneda de Facturación</label>
              <select 
                value={formData.moneda}
                onChange={e => setFormData({...formData, moneda: e.target.value})}
                className="w-full h-10 bg-input-bg border border-border rounded-sm px-3 py-2 text-sm text-text-main focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all appearance-none"
              >
                <option value="S/">Soles (S/)</option>
              </select>
              <p className="text-[11px] text-text-muted mt-1">Fijo en Soles según configuración global.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-text-muted">Teléfono Público</label>
              <Input 
                type="text" 
                value={formData.telefono}
                onChange={e => setFormData({...formData, telefono: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-muted">Dirección del Local</label>
            <Input 
              type="text" 
              value={formData.direccion}
              onChange={e => setFormData({...formData, direccion: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-muted">Correo Público (Contacto)</label>
            <Input 
              type="email" 
              value={formData.correoContacto}
              onChange={e => setFormData({...formData, correoContacto: e.target.value})}
            />
          </div>

          <div className="pt-4">
            <Button type="submit">
              <Save className="w-4 h-4 mr-2" />
              Guardar Configuración
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
