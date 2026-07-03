"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useUsers } from "@/hooks/useUsers";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersTable } from "@/components/users/UsersTable";
import { UserFormModal } from "@/components/users/UserFormModal";
import { UserDeleteModal } from "@/components/users/UserDeleteModal";
import { Cliente } from "@/types/cliente";

export default function UsersPage() {
  const { users, loading, totalPages, totalElements, fetchUsers, saveUser, deleteUser, toggleUserStatus } = useUsers();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // page - 1 because Spring Boot pagination is 0-indexed
    fetchUsers(currentPage - 1, itemsPerPage);
  }, [fetchUsers, currentPage, itemsPerPage]);

  // Handlers for Form
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

  const handleSave = async (formData: any) => {
    const { planId, ...rest } = formData;
    const payload = {
      ...rest,
      empresa: { idEmpresa: 1 } // Hardcoded temporalmente
    };
    await saveUser(payload, editingId, planId ? Number(planId) : undefined);
  };

  // Handlers for Delete
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
        onOpenNewModal={handleOpenNew}
        users={users}
      />

      <Card className="overflow-hidden bg-surface">
        <UsersTable 
          users={users}
          loading={loading}
          searchTerm={searchTerm}
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
