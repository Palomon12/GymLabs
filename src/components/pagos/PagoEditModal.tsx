import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pago } from "@/types/pago";

interface PagoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pagoId: number, data: Partial<Pago>) => void;
  initialData: Pago | null;
  isSubmitting: boolean;
}

export function PagoEditModal({ isOpen, onClose, onSave, initialData, isSubmitting }: PagoEditModalProps) {
  const [monto, setMonto] = useState<string>("");
  const [estadoPago, setEstadoPago] = useState<Pago['estadoPago']>("PENDIENTE");
  const [metodoPago, setMetodoPago] = useState<Pago['metodoPago']>("EFECTIVO");

  useEffect(() => {
    if (initialData) {
      setMonto(initialData.monto.toString());
      setEstadoPago(initialData.estadoPago);
      setMetodoPago(initialData.metodoPago);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      onSave(initialData.idPago, {
        monto: parseFloat(monto),
        estadoPago,
        metodoPago
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Pago">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-muted">Monto (S/)</label>
          <Input
            type="number"
            step="0.01"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            className="bg-[#1A1A1A] border-[#333] text-white"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-muted">Estado del Pago</label>
          <select
            value={estadoPago}
            onChange={(e) => setEstadoPago(e.target.value as Pago['estadoPago'])}
            className="w-full h-10 px-3 rounded-md border border-[#333] bg-[#1A1A1A] text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="COMPLETADO">COMPLETADO</option>
            <option value="CANCELADO">CANCELADO</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-muted">Método de Pago</label>
          <select
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value as Pago['metodoPago'])}
            className="w-full h-10 px-3 rounded-md border border-[#333] bg-[#1A1A1A] text-white focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="EFECTIVO">EFECTIVO</option>
            <option value="TARJETA">TARJETA</option>
            <option value="TRANSFERENCIA">TRANSFERENCIA</option>
          </select>
        </div>

        <div className="pt-6 flex justify-end gap-3 border-t border-[#222222] mt-6">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
