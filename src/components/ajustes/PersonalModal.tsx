import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    dni: "",
    telefono: "",
    correo: "",
    rol: "RECEPCIONISTA",
    contrasena: ""
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nombre: initialData.nombre || "",
        apellido: initialData.apellido || "",
        dni: initialData.dni || "",
        telefono: initialData.telefono || "",
        correo: initialData.correo || "",
        rol: initialData.rol || "RECEPCIONISTA",
        contrasena: ""
      });
    } else {
      setFormData({ nombre: "", apellido: "", dni: "", telefono: "", correo: "", rol: "RECEPCIONISTA", contrasena: "" });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Editar Usuario" : "Nuevo Usuario"}>
      <form onSubmit={handleSubmit} className="space-y-6 mt-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-muted">Nombres</label>
            <Input 
              required
              type="text" 
              value={formData.nombre}
              onChange={e => setFormData({...formData, nombre: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-muted">Apellidos</label>
            <Input 
              required
              type="text" 
              value={formData.apellido}
              onChange={e => setFormData({...formData, apellido: e.target.value})}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-muted">DNI</label>
            <Input 
              required
              type="text" 
              maxLength={15}
              value={formData.dni}
              onChange={e => setFormData({...formData, dni: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-muted">Teléfono</label>
            <Input 
              required
              type="text" 
              maxLength={20}
              value={formData.telefono}
              onChange={e => setFormData({...formData, telefono: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-muted">Correo Electrónico (Para Login)</label>
          <Input 
            required
            type="email" 
            value={formData.correo}
            onChange={e => setFormData({...formData, correo: e.target.value})}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-muted">Rol de Acceso</label>
          <select 
            value={formData.rol}
            onChange={e => setFormData({...formData, rol: e.target.value})}
            className="w-full h-10 bg-input-bg border border-border rounded-sm px-3 py-2 text-sm text-text-main focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all appearance-none"
          >
            <option value="RECEPCIONISTA">Recepcionista</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-text-muted">
            {initialData ? "Nueva Contraseña (Opcional)" : "Contraseña de Acceso"}
          </label>
          <Input 
            required={!initialData}
            type="password" 
            value={formData.contrasena}
            onChange={e => setFormData({...formData, contrasena: e.target.value})}
            placeholder={initialData ? "Dejar en blanco para mantener actual" : ""}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#222]">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            {initialData ? "Guardar Cambios" : "Crear Usuario"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
