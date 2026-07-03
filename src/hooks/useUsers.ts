import { useState, useCallback } from "react";
import { Cliente } from "@/types/cliente";
import { API_BASE_URL } from "@/config/api";

export function useUsers() {
  const [users, setUsers] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchUsers = useCallback(async (page: number = 0, size: number = 10, searchTerm: string = "", filterStatus: string = "ALL") => {
    setLoading(true);
    try {
      const url = new URL(`${API_BASE_URL}/clientes`);
      url.searchParams.append("page", page.toString());
      url.searchParams.append("size", size.toString());
      if (searchTerm) url.searchParams.append("searchTerm", searchTerm);
      url.searchParams.append("filterStatus", filterStatus);

      const res = await fetch(url.toString());
      const data = await res.json();
      
      if (Array.isArray(data)) {
        // Fallback for when backend hasn't finished deploying yet
        setUsers(data);
        setTotalPages(Math.ceil(data.length / size));
        setTotalElements(data.length);
      } else {
        // New Page<Cliente> format
        setUsers(data.content || []);
        setTotalPages(data.totalPages || 0);
        setTotalElements(data.totalElements || 0);
      }
    } catch (err) {
      console.error("Error fetching clientes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveUser = async (user: Partial<Cliente>, editingId: number | null, planId?: number) => {
    const isEditing = editingId !== null;
    let url = isEditing 
      ? `${API_BASE_URL}/clientes/${editingId}`
      : `${API_BASE_URL}/clientes`;
    
    if (!isEditing && planId) {
      url += `?planId=${planId}`;
    }

    const response = await fetch(url, {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    
    // Si sale bien, no recargamos la lista aquí directamente sin los filtros, 
    // preferible que el componente padre vuelva a llamar a fetchUsers o retornamos success.
  };

  const deleteUser = async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el cliente.");
    }

    // Si sale bien, que el componente padre recargue
  };

  const toggleUserStatus = async (id: number, planId?: number) => {
    // Optimistic update locally
    setUsers(prev => prev.map(u => u.idCliente === id ? { ...u, activo: !u.activo } : u));
    
    try {
      const url = planId 
        ? `${API_BASE_URL}/clientes/${id}/toggle-estado?planId=${planId}`
        : `${API_BASE_URL}/clientes/${id}/toggle-estado`;

      const response = await fetch(url, {
        method: "PATCH"
      });

      if (!response.ok) {
        throw new Error("Error al cambiar estado.");
      }
      
      const updatedUser = await response.json();
      setUsers(prev => prev.map(u => u.idCliente === id ? updatedUser : u));
    } catch (error) {
      // Revert if error
      setUsers(prev => prev.map(u => u.idCliente === id ? { ...u, activo: !u.activo } : u));
      throw error;
    }
  };

  return {
    users,
    loading,
    totalPages,
    totalElements,
    fetchUsers,
    saveUser,
    deleteUser,
    toggleUserStatus
  };
}
