import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface UserDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export function UserDeleteModal({ isOpen, onClose, onConfirm, isDeleting }: UserDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Eliminar Cliente">
      <div className="space-y-4">
        <p className="text-text-muted text-sm">
          ¿Estás seguro de que deseas eliminar permanentemente a este cliente? Esta acción borrará todos sus datos de la base de datos y no se puede deshacer.
        </p>
        <div className="pt-4 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button variant="primary" className="bg-red-600 border-red-600 hover:bg-red-700 text-white" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Eliminando..." : "Sí, Eliminar"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
