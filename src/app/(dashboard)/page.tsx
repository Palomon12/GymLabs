"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersTable } from "@/components/users/UsersTable";
import { UserFormModal } from "@/components/users/UserFormModal";
import { UserDeleteModal } from "@/components/users/UserDeleteModal";
import { Cliente } from "@/types/cliente";
import { DEFAULT_EMPRESA_ID } from "@/config/constants";
import { API_BASE_URL } from "@/config/api";
import { useAuth } from "@/context/AuthContext";

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Partial<Cliente> | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = useCallback(async (page: number, size: number, search: string, status: string) => {
    if (!user) return;
    setLoading(true);
    try {
      const url = new URL(`${API_BASE_URL}/clientes`);
      url.searchParams.append("page", page.toString());
      url.searchParams.append("size", size.toString());
      url.searchParams.append("empresaId", (user?.idEmpresa || 1).toString());
      if (search) url.searchParams.append("searchTerm", search);
      url.searchParams.append("filterStatus", status);
      
      const response = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setUsers(data);
          setTotalPages(Math.ceil(data.length / size));
          setTotalElements(data.length);
        } else {
          setUsers(data.content || []);
          setTotalPages(data.totalPages || 0);
          setTotalElements(data.totalElements || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUsers(currentPage - 1, itemsPerPage, searchTerm, filterStatus);
  }, [fetchUsers, currentPage, itemsPerPage, searchTerm, filterStatus]);

  const saveUser = async (userData: Partial<Cliente>, id?: number | null, planId?: number) => {
    if (!user) return;
    let url = id 
      ? `${API_BASE_URL}/clientes/${id}`
      : `${API_BASE_URL}/clientes`;
    
    if (!id && planId) {
      url += `?planId=${planId}`;
    }
      
    const method = id ? 'PUT' : 'POST';
    
    const response = await fetch(url, {
      method,
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}` 
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Error al guardar el usuario");
    }
    return response.json();
  };

  const deleteUser = async (id: number) => {
    if (!user) return;
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${user.token}` }
    });
    if (!response.ok) throw new Error("Error al eliminar el usuario");
  };

  const toggleUserStatus = async (id: number, planId?: number) => {
    if (!user) return;
    const url = planId 
      ? `${API_BASE_URL}/clientes/${id}/toggle-estado?planId=${planId}`
      : `${API_BASE_URL}/clientes/${id}/toggle-estado`;

    const response = await fetch(url, { 
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${user.token}` }
    });
    if (!response.ok) throw new Error("Error al cambiar el estado");
    fetchUsers(currentPage - 1, itemsPerPage, searchTerm, filterStatus);
  };

  const handleOpenNew = () => {
    setEditingData(null);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: Cliente) => {
    setEditingData({
      nombre: user.nombre,
      apellido: user.apellido,
      dni: user.dni,
      telefono: user.telefono || "",
      correo: user.correo || "",
      direccion: user.direccion || ""
    });
    setEditingId(user.idCliente);
    setIsModalOpen(true);
  };

  const handleSave = async (formData: Partial<Cliente> & { planId?: string }) => {
    const { planId, ...rest } = formData;
    const payload = {
      ...rest,
      empresa: { idEmpresa: user?.idEmpresa || 1 }
    };
    await saveUser(payload, editingId, planId ? Number(planId) : undefined);
    fetchUsers(currentPage - 1, itemsPerPage, searchTerm, filterStatus);
  };

  const handleDeleteClick = (id: number) => {
    setUserToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete === null) return;
    setIsDeleting(true);
    try {
      await deleteUser(userToDelete);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers(currentPage - 1, itemsPerPage, searchTerm, filterStatus);
    } catch (error) {
      alert(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <UsersHeader 
        searchTerm={searchTerm} 
        onSearchChange={(val) => {
          setSearchTerm(val);
          setCurrentPage(1);
        }}
        filterStatus={filterStatus}
        onFilterChange={(val) => {
          setFilterStatus(val);
          setCurrentPage(1);
        }}
        onOpenNewModal={handleOpenNew}
        users={users}
      />

      <Card className="overflow-hidden bg-surface">
        <UsersTable 
          users={users}
          loading={loading}
          searchTerm={searchTerm}
          filterStatus={filterStatus}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          serverTotalPages={totalPages}
          serverTotalElements={totalElements}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
          onToggleStatus={toggleUserStatus}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(items) => {
            setItemsPerPage(items);
            setCurrentPage(1);
          }}
        />
      </Card>

      <UserFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSave}
        initialData={editingData}
        isEditing={editingId !== null}
      />

      <UserDeleteModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
