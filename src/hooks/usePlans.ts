import { useState, useEffect, useCallback } from 'react';
import { Plan } from '../types/plan';
import { API_BASE_URL } from '@/config/api';
import { DEFAULT_EMPRESA_ID } from '@/config/constants';

export const usePlans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/planes`);
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const savePlan = async (planData: Partial<Plan>, editingId: number | null) => {
    const isEditing = editingId !== null;
    const url = isEditing 
      ? `${API_BASE_URL}/planes/${editingId}`
      : `${API_BASE_URL}/planes`;
    
    // Inject empresa payload
    const payload = {
      ...planData,
      empresa: { idEmpresa: DEFAULT_EMPRESA_ID }
    };

    const response = await fetch(url, {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Error al guardar el plan");
    }
    
    await fetchPlans(); // Recargar tras guardar
  };

  const deletePlan = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/planes/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el plan.");
    }

    await fetchPlans(); // Recargar tras borrar
  };

  return { plans, loading, fetchPlans, savePlan, deletePlan };
};
