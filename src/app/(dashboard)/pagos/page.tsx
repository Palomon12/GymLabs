"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/config/api";
import { Pago } from "@/types/pago";
import { Card } from "@/components/ui/card";
import { PagosTable } from "@/components/pagos/PagosTable";
import { PagoEditModal } from "@/components/pagos/PagoEditModal";
import { toast } from "sonner";
import { Wallet, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function PagosPage() {
  const { user } = useAuth();
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPago, setEditingPago] = useState<Pago | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPagos = useCallback(async () => {
    if (!user || user.rol === 'ROLE_RECEPCIONISTA' || user.rol === 'RECEPCIONISTA') return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/pagos?empresaId=${user.idEmpresa || 1}`, {
        credentials: "include",
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPagos(data);
      } else {
        toast.error("Error al cargar el historial de pagos.");
      }
    } catch (error) {
      toast.error("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPagos();
  }, [fetchPagos]);

  const handleEditClick = (pago: Pago) => {
    setEditingPago(pago);
    setIsModalOpen(true);
  };

  const handleSavePago = async (pagoId: number, data: Partial<Pago>) => {
    if (!user) return;
    setIsSubmitting(true);
    
    try {
      // First get the existing Pago to maintain other fields
      const getRes = await fetch(`${API_BASE_URL}/pagos/${pagoId}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (!getRes.ok) throw new Error("Pago no encontrado");
      const existingPago = await getRes.json();
      
      const updatedPago = {
        ...existingPago,
        ...data
      };

      const response = await fetch(`${API_BASE_URL}/pagos/${pagoId}`, {
        method: "PUT",
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` 
        },
        body: JSON.stringify(updatedPago),
      });

      if (response.ok) {
        toast.success("Pago actualizado exitosamente.");
        setIsModalOpen(false);
        fetchPagos(); // Refresh the list to affect the dashboard globally
      } else {
        throw new Error("Error al actualizar el pago");
      }
    } catch (error: any) {
      toast.error(error.message || "Ocurrió un error al guardar los cambios.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Restricción de acceso para recepcionistas (aunque el Sidebar lo oculte, protegemos la ruta)
  if (user?.rol === 'ROLE_RECEPCIONISTA' || user?.rol === 'RECEPCIONISTA') {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <Wallet className="w-16 h-16 text-[#333] mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Acceso Restringido</h2>
        <p className="text-text-muted max-w-md">No tienes los permisos necesarios para gestionar el módulo financiero. Contacta con el administrador.</p>
      </div>
    );
  }

  // Filtro de búsqueda
  const filteredPagos = pagos.filter(p => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const clientName = p.membresia?.cliente ? `${p.membresia.cliente.nombre} ${p.membresia.cliente.apellido}`.toLowerCase() : "";
    const clientDni = p.membresia?.cliente?.dni || "";
    const planName = p.membresia?.plan?.nombrePlan?.toLowerCase() || "";
    
    return clientName.includes(term) || clientDni.includes(term) || planName.includes(term);
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-1">Gestión de Pagos</h2>
          <p className="text-text-muted">Administra el historial de transacciones y altera sus estados.</p>
        </div>
        
        <div className="w-full sm:w-[350px]">
          <Input 
            icon={<Search className="w-4 h-4" />}
            placeholder="Buscar por cliente, DNI o plan..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-11 w-full bg-[#121212] border-[#222] text-base"
          />
        </div>
      </div>

      <Card className="overflow-hidden bg-[#1A1A1A] border-[#222]">
        <PagosTable 
          pagos={filteredPagos} 
          loading={loading} 
          onEdit={handleEditClick} 
        />
      </Card>

      <PagoEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSavePago}
        initialData={editingPago}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
