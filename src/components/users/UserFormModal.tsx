import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
  initialData?: any;
  isEditing: boolean;
}

export function UserFormModal({ isOpen, onClose, onSubmit, initialData, isEditing }: UserFormModalProps) {
  const [formData, setFormData] = useState({
    nombre: "", apellido: "", dni: "", telefono: "", correo: "", direccion: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({ nombre: "", apellido: "", dni: "", telefono: "", correo: "", direccion: "" });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido.";
    if (!formData.apellido.trim()) newErrors.apellido = "El apellido es requerido.";
    
    if (!formData.dni.trim()) {
      newErrors.dni = "El DNI es requerido.";
    } else if (!/^\d{8}$/.test(formData.dni.trim())) {
      newErrors.dni = "El DNI debe tener exactamente 8 dígitos numéricos.";
    }

    if (formData.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = "Ingresa un correo electrónico válido.";
    }

    if (formData.telefono && !/^\d{9,15}$/.test(formData.telefono.replace(/\s+/g, ''))) {
      newErrors.telefono = "Ingresa un número de teléfono válido (9+ dígitos).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose(); // Cerrar modal al guardar exitosamente
    } catch (error: any) {
       alert(error.message || "Error al procesar la solicitud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Editar Miembro" : "Registrar Nuevo Miembro"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">Nombre</label>
            <Input name="nombre" value={formData.nombre} onChange={handleInputChange} placeholder="Ej. Carlos" />
            {errors.nombre && <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">Apellido</label>
            <Input name="apellido" value={formData.apellido} onChange={handleInputChange} placeholder="Ej. Mendoza" />
            {errors.apellido && <p className="text-red-500 text-xs mt-1">{errors.apellido}</p>}
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">DNI</label>
          <Input name="dni" value={formData.dni} onChange={handleInputChange} placeholder="Ej. 45283910" />
          {errors.dni && <p className="text-red-500 text-xs mt-1">{errors.dni}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">Teléfono</label>
            <Input name="telefono" value={formData.telefono} onChange={handleInputChange} placeholder="Opcional" />
            {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">Correo Electrónico</label>
            <Input name="correo" type="email" value={formData.correo} onChange={handleInputChange} placeholder="ejemplo@correo.com" />
            {errors.correo && <p className="text-red-500 text-xs mt-1">{errors.correo}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">Dirección</label>
          <Input name="direccion" value={formData.direccion} onChange={handleInputChange} placeholder="Opcional" />
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Miembro"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
