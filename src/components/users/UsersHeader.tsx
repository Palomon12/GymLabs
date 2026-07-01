import { Search, Filter, Download, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Cliente } from "@/types/cliente";

interface UsersHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onOpenNewModal: () => void;
  users: Cliente[];
}

export function UsersHeader({ searchTerm, onSearchChange, onOpenNewModal, users }: UsersHeaderProps) {
  const exportToCSV = () => {
    if (users.length === 0) {
      alert("No hay datos para exportar.");
      return;
    }

    const headers = ["Nombre", "Apellido", "DNI", "Teléfono", "Correo", "Dirección", "Fecha de Registro", "Estado"];
    const csvRows = [headers.join(",")];

    users.forEach(user => {
      const row = [
        `"${user.nombre}"`,
        `"${user.apellido}"`,
        `"${user.dni}"`,
        `"${user.telefono || 'N/A'}"`,
        `"${user.correo || 'N/A'}"`,
        `"${user.direccion || 'N/A'}"`,
        `"${user.fechaRegistro ? new Date(user.fechaRegistro).toLocaleDateString() : 'N/A'}"`,
        `"${user.activo ? 'Activo' : 'Inactivo'}"`
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Directorio_Usuarios.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
      <div className="whitespace-nowrap">
        <h2 className="text-3xl font-bold tracking-tight mb-1">Directorio de Usuarios</h2>
        <p className="text-text-muted">Gestión administrativa de accesos y membresías.</p>
      </div>
      
      <div className="flex flex-col gap-3 w-full sm:w-auto items-end">
        {/* Barra de búsqueda dinámica (Agrandada) */}
        <div className="w-full sm:w-[450px]">
          <Input 
            icon={<Search className="w-4 h-4" />}
            placeholder="Buscar por nombre, apellido o DNI..." 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-11 w-full bg-[#121212] border-border text-base"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button variant="primary" className="h-10 flex-1 sm:flex-none" onClick={onOpenNewModal}>
            <Plus className="w-4 h-4 mr-2" /> Agregar Miembro
          </Button>
          <Button variant="secondary" className="h-10 flex-1 sm:flex-none">
            <Filter className="w-4 h-4 mr-2" /> Filtros
          </Button>
          <Button variant="secondary" className="h-10 text-primary border-primary hover:bg-primary/10 flex-1 sm:flex-none" onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" /> Exportar
          </Button>
        </div>
      </div>
    </div>
  );
}
