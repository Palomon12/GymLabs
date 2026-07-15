import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Save } from "lucide-react";

interface PersonalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  initialData?: any;
}

export function PersonalModal({ isOpen, onClose, onSave, initialData }: PersonalModalProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    rol: "RECEPCIONISTA",
    contrasena: ""
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || "",
        apellido: initialData.apellido || "",
        correo: initialData.correo || "",
        rol: initialData.rol || "RECEPCIONISTA",
        contrasena: "" // No mostramos la contraseña actual por seguridad
      });
    } else {
      setFormData({ nombre: "", apellido: "", correo: "", rol: "RECEPCIONISTA", contrasena: "" });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Editar Usuario" : "Nuevo Usuario"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Nombre</label>
            <input 
              required
              type="text" 
              value={formData.nombre}
              onChange={e => setFormData({...formData, nombre: e.target.value})}
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-muted">Apellidos</label>
            <input 
              required
              type="text" 
              value={formData.apellido}
              onChange={e => setFormData({...formData, apellido: e.target.value})}
              className="w-full bg-[#1A1A1A] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-muted">Correo Electrónico (Para Login)</label>
          <input 
            required
            type="email" 
            value={formData.correo}
            onChange={e => setFormData({...formData, correo: e.target.value})}
            className="w-full bg-[#1A1A1A] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-muted">Rol de Acceso</label>
          <select 
            value={formData.rol}
            onChange={e => setFormData({...formData, rol: e.target.value})}
            className="w-full bg-[#1A1A1A] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
          >
            <option value="RECEPCIONISTA">Recepcionista</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-muted">
            {initialData ? "Nueva Contraseña (Opcional)" : "Contraseña de Acceso"}
          </label>
          <input 
            required={!initialData}
            type="password" 
            value={formData.contrasena}
            onChange={e => setFormData({...formData, contrasena: e.target.value})}
            placeholder={initialData ? "Dejar en blanco para mantener actual" : ""}
            className="w-full bg-[#1A1A1A] border border-[#333] rounded-md px-3 py-2 text-white focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button type="button" variant="secondary" onClick={onClose} className="border-[#333]">
            Cancelar
          </Button>
          <Button type="submit" className="bg-primary text-[#121212] hover:bg-[#a6d600]">
            <Save className="w-4 h-4 mr-2" />
            {initialData ? "Guardar Cambios" : "Crear Usuario"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
