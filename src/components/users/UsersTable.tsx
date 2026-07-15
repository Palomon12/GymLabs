import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Edit, Trash2 } from "lucide-react";
import { Cliente } from "@/types/cliente";
import { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config/api";

const getExpirationStyle = (user: Cliente) => {
  let expiration: Date;
  if (user.fechaVencimiento) {
    expiration = new Date(user.fechaVencimiento);
  } else if (user.fechaRegistro) {
    expiration = new Date(user.fechaRegistro);
    expiration.setDate(expiration.getDate() + 30);
  } else {
    return { text: "N/A", className: "text-text-muted" };
  }
  
  const today = new Date();
  const diffTime = expiration.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  let className = "";
  if (diffDays > 15) {
    className = "text-primary font-medium"; // Verde brillante (del tema)
  } else if (diffDays > 5 && diffDays <= 15) {
    className = "text-yellow-500 font-medium"; // Naranja/Amarillo de advertencia
  } else if (diffDays > 3 && diffDays <= 5) {
    className = "text-alert font-bold"; // Rojo del tema
  } else {
    className = "text-alert/70 font-bold"; // Rojo opaco
  }

  let text = "";
  if (diffDays < 0) {
    text = "Vencido";
  } else if (diffDays === 0) {
    text = "Vence hoy";
  } else if (diffDays === 1) {
    text = "Falta 1 día";
  } else {
    text = `Faltan ${diffDays} días`;
  }

  return { text, className };
};

interface UsersTableProps {
  users: Cliente[];
  loading: boolean;
  searchTerm: string;
  filterStatus: string;
  currentPage: number;
  itemsPerPage: number;
  serverTotalPages: number;
  serverTotalElements: number;
  onEdit: (user: Cliente) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number, planId?: number) => void;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

export function UsersTable({
  users,
  loading,
  searchTerm,
  filterStatus,
  currentPage,
  itemsPerPage,
  serverTotalPages,
  serverTotalElements,
  onEdit,
  onDelete,
  onToggleStatus,
  onPageChange,
  onItemsPerPageChange
}: UsersTableProps) {
  
  const [pendingToggleUser, setPendingToggleUser] = useState<Cliente | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    if (pendingToggleUser && pendingToggleUser.activo === false) {
      fetch(`${API_BASE_URL}/planes`)
        .then(res => res.json())
        .then(data => setPlans(data))
        .catch(console.error);
    }
  }, [pendingToggleUser]);

  const confirmToggle = () => {
    if (pendingToggleUser !== null) {
      const needsPlanSelection = pendingToggleUser.activo === false;
      if (needsPlanSelection && selectedPlanId) {
        onToggleStatus(pendingToggleUser.idCliente, selectedPlanId);
      } else if (!needsPlanSelection) {
        onToggleStatus(pendingToggleUser.idCliente);
      }
      setPendingToggleUser(null);
      setSelectedPlanId(null);
    }
  };
  
  const isActivating = pendingToggleUser ? pendingToggleUser.activo === false : false;
  const needsPlanSelection = pendingToggleUser ? isActivating : false;

  const currentUsers = users;

  return (
    <>
      <Modal 
        isOpen={pendingToggleUser !== null} 
        onClose={() => { setPendingToggleUser(null); setSelectedPlanId(null); }}
        title={needsPlanSelection ? "Seleccionar Plan de Activación" : "Confirmar Cambio de Estado"}
      >
        {needsPlanSelection ? (
          <div className="mb-6">
            <p className="text-text-muted mb-4">
              Para activar a este cliente, debes asignarle un nuevo plan que definirá su fecha de vencimiento:
            </p>
            <div className="grid gap-3">
              {plans.map(plan => (
                <div 
                  key={plan.idPlan}
                  onClick={() => setSelectedPlanId(plan.idPlan)}
                  className={`p-3 rounded-md border cursor-pointer transition-colors ${selectedPlanId === plan.idPlan ? 'border-primary bg-primary/10' : 'border-[#2A3F36] hover:border-primary/50'}`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-text-main">{plan.nombrePlan}</span>
                    <span className="text-primary font-bold">S/{plan.precio}</span>
                  </div>
                  <p className="text-xs text-text-muted">{plan.descripcion} ({plan.duracionMeses} mes{plan.duracionMeses > 1 ? 'es' : ''})</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-text-muted mb-6">
            ¿Estás seguro de que deseas cambiar el estado de este cliente? 
            <br /><br />
            <span className="text-text-main font-semibold">Al Activar:</span> Se renovará automáticamente su última membresía por su duración correspondiente.
            <br />
            <span className="text-text-main font-semibold">Al Desactivar:</span> Su membresía actual será marcada como VENCIDA.
          </p>
        )}
        <div className="flex justify-end gap-3 mt-4">
          <Button 
            variant="secondary" 
            onClick={() => { setPendingToggleUser(null); setSelectedPlanId(null); }}
            className="bg-[#1A1A1A] border-[#2A3F36] text-text-main hover:bg-[#2A3F36]"
          >
            Cancelar
          </Button>
          <Button 
            onClick={confirmToggle}
            disabled={needsPlanSelection && !selectedPlanId}
            className="bg-primary text-[#121212] hover:bg-[#a6d600] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {needsPlanSelection ? "Asignar y Activar" : "Confirmar"}
          </Button>
        </div>
      </Modal>

      <div className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-[#121212] hover:bg-[#121212]">
              <TableHead className="w-[300px]">Nombre</TableHead>
              <TableHead>DNI</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Vencimiento</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-text-muted">
                  Cargando usuarios...
                </TableCell>
              </TableRow>
            ) : currentUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-text-muted">
                  {searchTerm ? "No se encontraron coincidencias para tu búsqueda." : "No se encontraron usuarios."}
                </TableCell>
              </TableRow>
            ) : (
              currentUsers.map((user) => {
                const isInactive = user.activo === false;
                
                return (
                <TableRow key={user.idCliente} className={isInactive ? "opacity-50 transition-opacity" : "transition-opacity"}>
                  <TableCell className="font-medium text-text-main">{user.nombre} {user.apellido}</TableCell>
                  <TableCell className="text-text-muted font-mono">{user.dni}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* Toggle Switch */}
                      <button
                        onClick={() => setPendingToggleUser(user)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${!isInactive ? 'bg-primary' : 'bg-[#2A3F36]'}`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${!isInactive ? 'translate-x-[18px]' : 'translate-x-[2px]'}`} />
                      </button>
                      
                      {/* Badge de Estado */}
                      {!isInactive ? (
                        <Badge variant="active">Activo</Badge>
                      ) : (
                        <Badge variant="inactive" className="bg-red-900/30 text-red-500 border-red-500/50">Inactivo</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className={getExpirationStyle(user).className}>
                    {getExpirationStyle(user).text}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">

                      <Button variant="secondary" className="h-8 w-8 p-0 border-[#2A3F36] text-text-muted hover:text-blue-500 hover:border-blue-500" onClick={() => onEdit(user)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="secondary" className="h-8 w-8 p-0 border-[#2A3F36] text-text-muted hover:text-red-500 hover:border-red-500" onClick={() => onDelete(user.idCliente)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="p-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <span>Mostrando</span>
          <div className="relative">
            <select 
              value={itemsPerPage} 
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="h-8 rounded-md border border-[#222222] bg-[#111111] px-3 pr-8 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer hover:border-[#333333] transition-colors"
            >
              <option value={10}>10</option>
              <option value={30}>30</option>
              <option value={50}>50</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-muted">
              <svg className="h-3 w-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
          <span>de {serverTotalElements} usuarios</span>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            className="h-8 w-8 p-0 border-[#2A3F36] text-text-muted hover:text-text-main" 
            disabled={currentPage === 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          >
             <span className="sr-only">Anterior</span>
             &lt;
          </Button>
          <Button 
            variant="secondary" 
            className="h-8 w-8 p-0 border-[#2A3F36] text-text-muted hover:text-text-main"
            disabled={currentPage >= serverTotalPages}
            onClick={() => onPageChange(Math.min(serverTotalPages, currentPage + 1))}
          >
             <span className="sr-only">Siguiente</span>
             &gt;
          </Button>
        </div>
      </div>
    </>
  );
}
