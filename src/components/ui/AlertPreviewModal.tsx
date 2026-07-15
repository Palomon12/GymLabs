import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface AlertPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  cliente: any;
  onConfirm: () => Promise<void>;
}

export function AlertPreviewModal({ isOpen, onClose, cliente, onConfirm }: AlertPreviewModalProps) {
  const [isSending, setIsSending] = useState(false);

  if (!cliente) return null;

  const diffDays = Math.ceil((new Date(cliente.fechaVencimiento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const urgencyText = diffDays <= 0 ? "ha vencido" : `vence en ${diffDays} días`;

  const handleConfirm = async () => {
    setIsSending(true);
    await onConfirm();
    setIsSending(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Vista Previa de Alerta">
      <div className="space-y-6">
        <p className="text-sm text-text-muted">Así es exactamente como {cliente.nombre} verá el correo electrónico en su dispositivo:</p>
        
        <div className="bg-[#0a0a0a] border border-[#222222] rounded-lg p-6 font-sans relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          
          <div className="mb-6">
             <h2 className="text-primary text-2xl font-black tracking-tighter m-0">GYMLABS</h2>
          </div>
          <h3 className="text-white text-lg font-bold mb-2">¡Hola {cliente.nombre}! 🏋️‍♂️</h3>
          <p className="text-[#a0a0a0] text-sm mb-4 leading-relaxed">
            Esperamos que estés teniendo excelentes entrenamientos. Te escribimos para recordarte que tu membresía actual <span className="text-primary font-bold">{urgencyText}</span>.
          </p>
          <p className="text-[#a0a0a0] text-sm mb-6 leading-relaxed">
            No dejes que tu progreso se detenga. Renueva tu plan ahora para mantener tu acceso sin interrupciones a todas nuestras instalaciones y clases exclusivas.
          </p>
          <div className="mb-6">
            <div className="bg-primary text-[#121212] font-bold py-3 px-6 rounded-md text-center inline-block cursor-default text-sm">
              Renovar mi Plan Ahora
            </div>
          </div>
          <hr className="border-[#222222] mb-4" />
          <p className="text-[#666666] text-xs text-center">
            GymLabs Elite Fitness<br />Este es un correo generado automáticamente.
          </p>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-[#222222]">
          <Button variant="ghost" onClick={onClose} disabled={isSending}>Cancelar</Button>
          <Button variant="primary" onClick={handleConfirm} disabled={isSending}>
            {isSending ? (
               <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
                Enviando...
              </span>
            ) : "Confirmar Envío"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
