import { useState, useCallback } from "react";
import { Cliente } from "@/types/cliente";

export function useUsers() {
  const [users, setUsers] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const fetchUsers = useCallback(async (page: number = 0, size: number = 10) => {
    setLoading(true);
    try {
      const res = await fetch(`https://gymlabs-backend.onrender.com/api/clientes?page=${page}&size=${size}`);
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

  const saveUser = async (userPayload: any, editingId: number | null) => {
    const isEditing = editingId !== null;
    const url = isEditing 
      ? `https://gymlabs-backend.onrender.com/api/clientes/${editingId}`
      : "https://gymlabs-backend.onrender.com/api/clientes";

    const response = await fetch(url, {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userPayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    
    // Si sale bien, recargamos la lista
    await fetchUsers();
  };

  const deleteUser = async (id: number) => {
    const response = await fetch(`https://gymlabs-backend.onrender.com/api/clientes/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el cliente.");
    }

    // Si sale bien, recargamos la lista
    await fetchUsers();
  };

  const toggleUserStatus = async (id: number) => {
    // Optimistic update locally
    setUsers(prev => prev.map(u => u.idCliente === id ? { ...u, activo: !u.activo } : u));
    
    try {
      const response = await fetch(`https://gymlabs-backend.onrender.com/api/clientes/${id}/toggle-estado`, {
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
