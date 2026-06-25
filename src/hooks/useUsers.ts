import { useState, useCallback } from "react";
import { Cliente } from "@/types/cliente";

export function useUsers() {
  const [users, setUsers] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("https://gymlabs-backend.onrender.com/api/clientes");
      const data = await res.json();
      setUsers(data);
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
    
    const response = await fetch(`https://gymlabs-backend.onrender.com/api/clientes/${id}/toggle-estado`, {
      method: "PATCH"
    });

    if (!response.ok) {
      // Revert if error
      await fetchUsers();
      throw new Error("Error al cambiar estado.");
    }
  };

  return {
    users,
    loading,
    fetchUsers,
    saveUser,
    deleteUser,
    toggleUserStatus
  };
}
