import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { PersonalModal } from "./PersonalModal";

// Datos de prueba simulando la BD de "personal"
const mockStaff = [
  { id: 1, nombre: "Josué", apellido: "Admin", correo: "admin@gymlabs.com", rol: "ADMIN" },
  { id: 2, nombre: "Ana", apellido: "Recepción", correo: "recepcion@gymlabs.com", rol: "RECEPCIONISTA" },
];

export function TabPersonal() {
  const [staff, setStaff] = useState(mockStaff);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);

  const handleOpenNew = () => {
    setEditingStaff(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: any) => {
    setEditingStaff(user);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if(confirm("¿Estás seguro de eliminar este usuario del sistema? Ya no podrá iniciar sesión.")) {
      setStaff(staff.filter(s => s.id !== id));
    }
  };

  const handleSave = (data: any) => {
    if (editingStaff) {
      setStaff(staff.map(s => s.id === editingStaff.id ? { ...s, ...data } : s));
    } else {
      setStaff([...staff, { id: Date.now(), ...data }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Gestión de Personal</h2>
          <p className="text-sm text-text-muted">Administra quiénes tienen acceso al sistema.</p>
        </div>
        <Button onClick={handleOpenNew} className="bg-primary text-[#121212] hover:bg-[#a6d600]">
          <Plus className="w-4 h-4 mr-2" /> Nuevo Usuario
        </Button>
      </div>

      <div className="border border-[#222] rounded-lg overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#1A1A1A] border-b border-[#222]">
            <tr>
              <th className="px-4 py-3 font-medium text-text-muted">Nombre</th>
              <th className="px-4 py-3 font-medium text-text-muted">Correo</th>
              <th className="px-4 py-3 font-medium text-text-muted">Rol</th>
              <th className="px-4 py-3 font-medium text-text-muted text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222]">
            {staff.map((s) => (
              <tr key={s.id} className="hover:bg-[#1A1A1A]/50 transition-colors">
                <td className="px-4 py-3 font-medium text-white">{s.nombre} {s.apellido}</td>
                <td className="px-4 py-3 text-text-muted">{s.correo}</td>
                <td className="px-4 py-3">
                  {s.rol === 'ADMIN' ? (
                    <Badge className="bg-primary/20 text-primary border-primary/30">Administrador</Badge>
                  ) : (
                    <Badge variant="active" className="bg-blue-500/20 text-blue-400 border-blue-500/30">Recepcionista</Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(s)} className="text-text-muted hover:text-white h-8 w-8 p-0 mr-1">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)} className="text-text-muted hover:text-alert h-8 w-8 p-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <PersonalModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingStaff}
      />
    </div>
  );
}
