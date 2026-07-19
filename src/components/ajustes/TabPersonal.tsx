import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2 } from "lucide-react";
import { PersonalModal } from "./PersonalModal";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { API_BASE_URL } from "@/config/api";

export function TabPersonal() {
  const { user } = useAuth();
  const [staff, setStaff] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStaff = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/personal?empresaId=${user?.idEmpresa || 1}`, { 
        headers: { "Authorization": `Bearer ${user?.token}` },
        credentials: "include" 
      });
      if (response.ok) {
        const data = await response.json();
        setStaff(data);
      } else {
        toast.error("Error al cargar el personal");
      }
    } catch (error) {
      toast.error("Error al cargar el personal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleOpenNew = () => {
    setEditingStaff(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: any) => {
    // El backend devuelve idPersonal, pero en el frontend se maneja como objeto completo
    setEditingStaff({ ...user, rol: user.rol?.nombre || "RECEPCIONISTA" });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if(confirm("¿Estás seguro de eliminar este usuario del sistema? Ya no podrá iniciar sesión.")) {
      try {
        const response = await fetch(`${API_BASE_URL}/personal/${id}`, { 
          method: "DELETE", 
          headers: { "Authorization": `Bearer ${user?.token}` },
          credentials: "include" 
        });
        if (response.ok) {
          toast.success("Usuario eliminado exitosamente");
          fetchStaff();
        } else {
          toast.error("Error al eliminar usuario");
        }
      } catch (error) {
        toast.error("Error al eliminar usuario");
      }
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (data: any) => {
    setIsSubmitting(true);
    try {
      let response;
      if (editingStaff) {
        response = await fetch(`${API_BASE_URL}/personal/${editingStaff.idPersonal}?empresaId=${user?.idEmpresa || 1}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user?.token}`
          },
          credentials: "include",
          body: JSON.stringify(data)
        });
      } else {
        response = await fetch(`${API_BASE_URL}/personal?empresaId=${user?.idEmpresa || 1}`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user?.token}`
          },
          credentials: "include",
          body: JSON.stringify(data)
        });
      }
      
      if (response.ok) {
        toast.success(editingStaff ? "Usuario actualizado exitosamente" : "Usuario creado exitosamente");
        setIsModalOpen(false);
        fetchStaff();
      } else if (response.status === 409) {
        const errMsg = await response.text();
        toast.error(errMsg || "El correo o DNI ya está en uso");
      } else {
        const errMsg = await response.text();
        toast.error(errMsg || "Error al guardar el usuario");
      }
    } catch (error: any) {
      toast.error("Error al guardar el usuario");
    } finally {
      setIsSubmitting(false);
    }
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
                <th className="px-6 py-4 font-semibold text-text-muted">DNI</th>
                <th className="px-6 py-4 font-semibold text-text-muted">Teléfono</th>
                <th className="px-6 py-4 font-semibold text-text-muted">Correo de Acceso</th>
                <th className="px-6 py-4 font-semibold text-text-muted">Rol</th>
                <th className="px-6 py-4 font-semibold text-text-muted text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222]">
              {staff.map((s) => (
                <tr key={s.idPersonal} className="hover:bg-[#222] transition-colors group">
                  <td className="px-6 py-4 font-medium text-white">
                    {s.nombre} {s.apellido}
                  </td>
                  <td className="px-6 py-4 text-text-muted">{s.dni || '-'}</td>
                  <td className="px-6 py-4 text-text-muted">{s.telefono || '-'}</td>
                  <td className="px-6 py-4 text-text-muted">{s.correo}</td>
                  <td className="px-6 py-4">
                    {s.rol?.nombre === 'SUPERADMIN' ? (
                      <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">Super Admin</Badge>
                    ) : s.rol?.nombre === 'ADMIN' ? (
                      <Badge className="bg-primary/10 text-primary border-primary/20">Administrador</Badge>
                    ) : (
                      <Badge variant="active" className="bg-blue-500/10 text-blue-400 border-blue-500/20">Recepcionista</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {(() => {
                      // Determine if current user can edit this staff member
                      const currentUserRole = user?.rol || "";
                      const isSuperAdmin = currentUserRole === "ROLE_SUPERADMIN" || currentUserRole === "SUPERADMIN";
                      const isAdmin = currentUserRole === "ROLE_ADMIN" || currentUserRole === "ADMIN";
                      const staffRole = s.rol?.nombre || "";
                      
                      let canEditDelete = false;
                      if (isSuperAdmin) {
                        canEditDelete = true;
                      } else if (isAdmin) {
                        canEditDelete = staffRole !== "SUPERADMIN" && staffRole !== "ADMIN";
                      }
                      
                      if (!canEditDelete) return null;
                      
                      return (
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(s)} className="text-text-muted hover:text-white h-8 w-8 p-0">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(s.idPersonal)} className="text-text-muted hover:text-alert hover:bg-alert/10 h-8 w-8 p-0">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })()}
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
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
