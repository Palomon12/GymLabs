import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { PersonalModal } from "./PersonalModal";

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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Gestión de Personal</h2>
          <p className="text-sm text-text-muted mt-1">Administra quiénes tienen acceso al sistema.</p>
        </div>
        <Button onClick={handleOpenNew}>
          <Plus className="w-4 h-4 mr-2" /> Nuevo Usuario
        </Button>
      </div>

      <div className="bg-[#1A1A1A] border border-[#222] rounded-xl overflow-hidden w-full">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[600px]">
            <thead className="bg-[#111] border-b border-[#222]">
              <tr>
                <th className="px-6 py-4 font-semibold text-text-muted">Nombre Completo</th>
                <th className="px-6 py-4 font-semibold text-text-muted">Correo de Acceso</th>
                <th className="px-6 py-4 font-semibold text-text-muted">Rol</th>
                <th className="px-6 py-4 font-semibold text-text-muted text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {staff.map((s) => (
                <tr key={s.id} className="hover:bg-[#222] transition-colors group">
                  <td className="px-6 py-4 font-medium text-white">
                    {s.nombre} {s.apellido}
                  </td>
                  <td className="px-6 py-4 text-text-muted">{s.correo}</td>
                  <td className="px-6 py-4">
                    {s.rol === 'ADMIN' ? (
                      <Badge className="bg-primary/10 text-primary border-primary/20">Administrador</Badge>
                    ) : (
                      <Badge variant="active" className="bg-blue-500/10 text-blue-400 border-blue-500/20">Recepcionista</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(s)} className="text-text-muted hover:text-white h-8 w-8 p-0">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)} className="text-text-muted hover:text-alert hover:bg-alert/10 h-8 w-8 p-0">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
