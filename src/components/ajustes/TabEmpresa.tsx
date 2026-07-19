import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, UploadCloud } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/config/api";
import { toast } from "sonner";

export function TabEmpresa() {
  const { user, updateUser } = useAuth();
  
  const [formData, setFormData] = useState({
    nombre: user?.empresaNombre || "GymLabs Elite Fitness",
    direccion: "Av. Principal 123, Ciudad", // Esto debería venir de user si existiera en context, pero lo dejamos estático por ahora o lo leemos si agregamos al context
    telefono: "+51 987 654 321",
    correoContacto: "contacto@gymlabs.com",
    moneda: "S/"
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Intentamos pre-llenar con los datos reales llamando al backend al cargar
  useEffect(() => {
    if (user?.idEmpresa) {
      fetch(`${API_BASE_URL}/empresas/${user.idEmpresa}`, {
        headers: { 'Authorization': `Bearer ${user.token}` },
        credentials: 'include'
      })
      .then(res => res.json())
      .then(data => {
        setFormData(prev => ({
          ...prev,
          nombre: data.nombre || prev.nombre,
          direccion: data.direccion || prev.direccion,
          telefono: data.telefono || prev.telefono,
          correoContacto: data.correo || prev.correoContacto
        }));
      })
      .catch(err => console.error("Error fetching empresa details:", err));
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.idEmpresa) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/empresas/${user.idEmpresa}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        credentials: 'include',
        body: JSON.stringify({
          nombre: formData.nombre,
          direccion: formData.direccion,
          telefono: formData.telefono,
          correo: formData.correoContacto,
          activo: true
        })
      });

      if (!response.ok) throw new Error("Error al guardar");
      
      toast.success("Ajustes de empresa guardados", { position: 'top-center' });
      
      // Update Context so the navbar reflects the new gym name
      updateUser({ empresaNombre: formData.nombre });
    } catch (error) {
      toast.error("Ocurrió un error al guardar", { position: 'top-center' });
    } finally {
      setIsSubmitting(false);
    }
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
            <Button type="submit" disabled={isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Guardando cambios..." : "Guardar Configuración"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
