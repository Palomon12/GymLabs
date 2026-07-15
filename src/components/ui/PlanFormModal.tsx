import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

interface PlanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
  initialData?: any;
  isEditing: boolean;
}

export function PlanFormModal({ isOpen, onClose, onSubmit, initialData, isEditing }: PlanFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombrePlan: "",
    descripcion: "",
    precio: 0,
    duracionMeses: 1,
    activo: true,
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ 
          nombrePlan: initialData.nombrePlan || "",
          descripcion: initialData.descripcion || "",
          precio: initialData.precio || 0,
          duracionMeses: initialData.duracionMeses || 1,
          activo: initialData.activo !== false, // Default true unless explicitly false
        });
      } else {
        setFormData({
          nombrePlan: "",
          descripcion: "",
          precio: 0,
          duracionMeses: 1,
          activo: true,
        });
      }
    }
  }, [isOpen, initialData]);

  const onFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error: any) {
      alert(error.message || "Error al guardar el plan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Editar Plan" : "Crear Nuevo Plan"}>
      <form onSubmit={onFormSubmit} className="space-y-4">
        
        <div className="space-y-2">
          <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">Nombre del Plan</label>
          <Input 
            required
            value={formData.nombrePlan}
            onChange={(e) => setFormData({...formData, nombrePlan: e.target.value})}
            placeholder="Ej. Plan Pro" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">Descripción</label>
          <Input 
            required
            value={formData.descripcion}
            onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
            placeholder="Ej. Acceso total 24/7" 
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">Precio (S/)</label>
            <Input 
              required
              type="number" 
              step="0.01" 
              min="0"
              value={formData.precio}
              onChange={(e) => setFormData({...formData, precio: parseFloat(e.target.value) || 0})}
              placeholder="Ej. 99.90" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">Duración</label>
            <div className="relative">
              <select 
                required
                value={formData.duracionMeses}
                onChange={(e) => setFormData({...formData, duracionMeses: parseInt(e.target.value) || 1})}
                className="flex h-11 w-full rounded-md border border-[#222222] bg-[#111111] px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all appearance-none cursor-pointer hover:border-[#333333]"
              >
                <option value={1} className="bg-[#111111] text-white py-2">1 mes</option>
                <option value={3} className="bg-[#111111] text-white py-2">3 meses</option>
                <option value={6} className="bg-[#111111] text-white py-2">6 meses</option>
                <option value={12} className="bg-[#111111] text-white py-2">12 meses</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-muted">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Estado Activo Toggle */}
        <div className="pt-2 flex items-center justify-between p-4 border border-[#222222] rounded-lg bg-[#111111]/50">
          <div>
            <p className="text-sm font-semibold text-white">Estado del Plan</p>
            <p className="text-xs text-text-muted mt-1">
              {formData.activo ? "Visible y disponible para venta" : "Oculto para nuevas ventas"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFormData({...formData, activo: !formData.activo})}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${formData.activo ? 'bg-primary' : 'bg-[#2A3F36]'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.activo ? 'translate-x-[22px]' : 'translate-x-[4px]'}`} />
          </button>
        </div>

        <div className="pt-6 flex justify-end gap-3 border-t border-[#222222] mt-6">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="hover:bg-[#111111] hover:text-white">
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting} className="min-w-[140px]">
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
                Guardando...
              </span>
            ) : "Guardar Plan"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
