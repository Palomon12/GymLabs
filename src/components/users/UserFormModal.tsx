import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/config/api";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
  initialData?: any;
  isEditing: boolean;
}

export function UserFormModal({ isOpen, onClose, onSubmit, initialData, isEditing }: UserFormModalProps) {
  const [plans, setPlans] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    correo: "",
    direccion: "",
    planId: ""
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ 
          nombre: initialData.nombre || "",
          apellido: initialData.apellido || "",
          dni: initialData.dni || "",
          telefono: initialData.telefono || "",
          correo: initialData.correo || "",
          direccion: initialData.direccion || "",
          planId: ""
        });
      } else {
        setFormData({ nombre: "", apellido: "", dni: "", telefono: "", correo: "", direccion: "", planId: "" });
      }
      
      // Fetch plans for dropdown
      const token = localStorage.getItem("gymlabs_auth") ? JSON.parse(localStorage.getItem("gymlabs_auth")!).token : "";
      fetch(`${API_BASE_URL}/planes`, { credentials: "include",
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setPlans(data))
        .catch(console.error);
    }
  }, [isOpen, initialData]);

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing && !formData.planId) {
      alert("Selecciona un plan.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error: any) {
      alert(error.message || "Error al procesar la solicitud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Editar Miembro" : "Registrar Nuevo Miembro"}>
      <form onSubmit={onFormSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">Nombre</label>
            <Input 
              required
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
              placeholder="Ej. Carlos" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">Apellido</label>
            <Input 
              required
              value={formData.apellido}
              onChange={(e) => setFormData({...formData, apellido: e.target.value})}
              placeholder="Ej. Mendoza" 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">DNI</label>
          <Input 
            required
            pattern="\d{8}"
            title="El DNI debe tener 8 dígitos numéricos"
            value={formData.dni}
            onChange={(e) => setFormData({...formData, dni: e.target.value})}
            placeholder="Ej. 45283910" 
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">Teléfono</label>
            <Input 
              pattern="\d{9,15}"
              title="Ingresa un teléfono válido"
              value={formData.telefono}
              onChange={(e) => setFormData({...formData, telefono: e.target.value})}
              placeholder="Opcional" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">Correo Electrónico</label>
            <Input 
              type="email" 
              value={formData.correo}
              onChange={(e) => setFormData({...formData, correo: e.target.value})}
              placeholder="ejemplo@correo.com" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">Dirección</label>
          <Input 
            value={formData.direccion}
            onChange={(e) => setFormData({...formData, direccion: e.target.value})}
            placeholder="Opcional" 
          />
        </div>

        {!isEditing && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">Plan Inicial</label>
            <div className="relative">
              <select 
                required
                value={formData.planId}
                onChange={(e) => setFormData({...formData, planId: e.target.value})}
                className="flex h-11 w-full rounded-md border border-[#222222] bg-[#111111] px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all appearance-none cursor-pointer hover:border-[#333333]"
              >
                <option value="" disabled className="bg-[#111111] text-text-muted">Selecciona un plan...</option>
                {plans.map(plan => (
                  <option key={plan.idPlan} value={plan.idPlan} className="bg-[#111111] text-white py-2">
                    {plan.nombrePlan} - S/{plan.precio} ({plan.duracionMeses} mes{plan.duracionMeses > 1 ? 'es' : ''})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-muted">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        )}

        <div className="pt-6 flex justify-end gap-3 border-t border-[#222222] mt-6">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="hover:bg-[#111111] hover:text-white">
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting} className="min-w-[140px]">
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
                Procesando...
              </span>
            ) : "Guardar Miembro"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
