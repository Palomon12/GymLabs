import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Check } from "lucide-react";

const planSchema = z.object({
  nombrePlan: z.string().min(1, "El nombre del plan es requerido."),
  descripcion: z.string().min(1, "La descripción es requerida."),
  precio: z.number()
    .positive("El precio debe ser mayor a 0.")
    .max(999, "El precio no puede exceder 999."),
  duracionMeses: z.number().int().positive("Selecciona una duración."),
  activo: z.boolean(),
});

type PlanFormValues = z.infer<typeof planSchema>;

interface PlanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
  initialData?: any;
  isEditing: boolean;
}

export function PlanFormModal({ isOpen, onClose, onSubmit, initialData, isEditing }: PlanFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors }
  } = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      nombrePlan: "",
      descripcion: "",
      precio: 0,
      duracionMeses: 1,
      activo: true,
    }
  });

  const activo = watch("activo");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({ 
          nombrePlan: initialData.nombrePlan || "",
          descripcion: initialData.descripcion || "",
          precio: initialData.precio || 0,
          duracionMeses: initialData.duracionMeses || 1,
          activo: initialData.activo !== false, // Default true unless explicitly false
        });
      } else {
        reset({
          nombrePlan: "",
          descripcion: "",
          precio: 0,
          duracionMeses: 1,
          activo: true,
        });
      }
    }
  }, [isOpen, initialData, reset]);

  const onFormSubmit = async (data: PlanFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error: any) {
      alert(error.message || "Error al guardar el plan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Editar Plan" : "Crear Nuevo Plan"}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        
        <div className="space-y-2">
          <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">Nombre del Plan</label>
          <Input {...register("nombrePlan")} placeholder="Ej. Plan Pro" />
          {errors.nombrePlan && <p className="text-alert text-xs mt-1">{errors.nombrePlan.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">Descripción</label>
          <Input {...register("descripcion")} placeholder="Ej. Acceso total 24/7" />
          {errors.descripcion && <p className="text-alert text-xs mt-1">{errors.descripcion.message}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">Precio (S/)</label>
            <Input type="number" step="0.01" {...register("precio", { valueAsNumber: true })} placeholder="Ej. 99.90" />
            {errors.precio && <p className="text-alert text-xs mt-1">{errors.precio.message}</p>}
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">Duración</label>
            <div className="relative">
              <select 
                {...register("duracionMeses", { valueAsNumber: true })}
                className="flex h-11 w-full rounded-md border border-[#222222] bg-[#111111] px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all appearance-none cursor-pointer hover:border-[#333333]"
              >
                <option value={1} className="bg-[#111111] text-white py-2">1 mes</option>
                <option value={3} className="bg-[#111111] text-white py-2">3 meses</option>
                <option value={6} className="bg-[#111111] text-white py-2">6 meses</option>
                <option value={12} className="bg-[#111111] text-white py-2">12 meses</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-muted">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            {errors.duracionMeses && <p className="text-alert text-xs mt-1">{errors.duracionMeses.message}</p>}
          </div>
        </div>

        {/* Estado Activo Toggle */}
        <div className="pt-2 flex items-center justify-between p-4 border border-[#222222] rounded-lg bg-[#111111]/50">
          <div>
            <p className="text-sm font-semibold text-white">Estado del Plan</p>
            <p className="text-xs text-text-muted mt-1">
              {activo ? "Visible y disponible para venta" : "Oculto para nuevas ventas"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setValue("activo", !activo)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${activo ? 'bg-primary' : 'bg-[#2A3F36]'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${activo ? 'translate-x-[22px]' : 'translate-x-[4px]'}`} />
          </button>
        </div>

        <div className="pt-6 flex justify-end gap-3 border-t border-[#222222] mt-6">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="hover:bg-[#111111] hover:text-white">
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting} className="min-w-[140px]">
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
                Guardando...
              </span>
            ) : "Guardar Plan"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
