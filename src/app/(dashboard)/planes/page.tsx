"use client";

import { Card } from "@/components/ui/card";
import { Check, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { PlanFormModal } from "@/components/ui/PlanFormModal";
import { Plan } from "@/types/plan";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/config/api";

export default function PlanesPage() {
  const { user } = useAuth();
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Partial<Plan> | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchPlanes = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/planes?empresaId=${user.idEmpresa || 1}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setPlanes(data);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanes();
  }, [user]);

  const handleOpenNew = () => {
    setEditingData(null);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (plan: Plan) => {
    setEditingData(plan);
    setEditingId(plan.idPlan);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!user || !confirm("¿Estás seguro de que deseas eliminar este plan?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/planes/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (!res.ok) throw new Error("Error al eliminar plan");
      fetchPlanes();
    } catch (err) {
      alert("No se pudo eliminar el plan. Es posible que esté asignado a membresías activas.");
    }
  };

  const handleSave = async (formData: any) => {
    if (!user) return;
    const url = editingId ? `${API_BASE_URL}/planes/${editingId}` : `${API_BASE_URL}/planes`;
    const method = editingId ? 'PUT' : 'POST';
    const payload = {
      ...formData,
      empresa: { idEmpresa: user.idEmpresa || 1 }
    };
    
    const res = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(payload),
    });
    
    if (!res.ok) throw new Error("Error al guardar el plan");
    fetchPlanes();
  };

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center text-text-muted">Cargando planes...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">Membresías y Planes</h2>
          <p className="text-text-muted">Gestiona los planes que ofreces a tus clientes.</p>
        </div>
        <Button className="bg-primary text-[#121212] hover:bg-[#a6d600]" onClick={handleOpenNew}>
          + Crear Nuevo Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {planes.length === 0 ? (
          <div className="col-span-full text-center py-12 text-text-muted bg-surface rounded-lg border border-border">
            No hay planes registrados.
          </div>
        ) : (
          planes.map((plan) => (
            <Card 
              key={plan.idPlan} 
              className={`p-6 bg-surface border-border flex flex-col relative overflow-hidden transition-all duration-300 hover:border-primary/50 group ${plan.nombrePlan.toLowerCase().includes('pro') ? 'border-primary/30 shadow-[0_0_15px_rgba(195,244,0,0.1)]' : ''}`}
            >
              {plan.nombrePlan.toLowerCase().includes('pro') && (
                <div className="absolute top-0 right-0 bg-primary text-[#121212] text-[10px] font-bold px-3 py-1 uppercase tracking-wider rounded-bl-lg">
                  Popular
                </div>
              )}
              
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${plan.nombrePlan.toLowerCase().includes('pro') ? 'bg-primary/20 text-primary' : 'bg-[#2A3F36] text-[#c3f400]'}`}>
                  {plan.nombrePlan.toLowerCase().includes('pro') ? <Star className="w-5 h-5" /> : <Zap className="w-5 h-5" />}
                </div>
                <h3 className="text-xl font-bold text-text-main">{plan.nombrePlan}</h3>
              </div>
              
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-text-main">S/{plan.precio?.toFixed(2)}</span>
                <span className="text-text-muted text-sm ml-1">/ mes</span>
              </div>
              
              <p className="text-text-muted text-sm mb-6 flex-grow">{plan.descripcion}</p>
              
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-2 text-sm text-text-main">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Duración: {plan.duracionMeses} mes(es)</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-text-main">
                  <Check className="w-4 h-4 text-primary" />
                  <span>Estado: {plan.activo ? "Activo" : "Inactivo"}</span>
                </div>
              </div>
              
              <div className="mt-auto flex gap-2">
                <Button variant="secondary" className="flex-1 bg-[#1A1A1A] border border-[#2A3F36] hover:bg-[#2A3F36] text-text-main" onClick={() => handleEdit(plan)}>
                  Editar
                </Button>
                <Button variant="secondary" className="px-3 bg-[#1A1A1A] border border-[#2A3F36] text-text-muted hover:text-red-500 hover:border-red-500" onClick={() => handleDelete(plan.idPlan)}>
                  Borrar
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <PlanFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        initialData={editingData}
        isEditing={editingId !== null}
      />
    </div>
  );
}
