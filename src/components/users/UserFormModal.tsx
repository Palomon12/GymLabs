import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { usePlans } from "@/hooks/usePlans";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const userSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido."),
  apellido: z.string().min(1, "El apellido es requerido."),
  dni: z.string().regex(/^\d{8}$/, "El DNI debe tener 8 dígitos numéricos."),
  telefono: z.string().regex(/^\d{9,15}$/, "Ingresa un teléfono válido.").optional().or(z.literal("")),
  correo: z.string().email("Correo electrónico inválido.").optional().or(z.literal("")),
  direccion: z.string().optional().or(z.literal("")),
  planId: z.string().optional(),
});

type UserFormValues = z.infer<typeof userSchema>;

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: any) => Promise<void>;
  initialData?: any;
  isEditing: boolean;
}

export function UserFormModal({ isOpen, onClose, onSubmit, initialData, isEditing }: UserFormModalProps) {
  const { plans } = usePlans();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors }
  } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      dni: "",
      telefono: "",
      correo: "",
      direccion: "",
      planId: ""
    }
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        reset({ 
          nombre: initialData.nombre || "",
          apellido: initialData.apellido || "",
          dni: initialData.dni || "",
          telefono: initialData.telefono || "",
          correo: initialData.correo || "",
          direccion: initialData.direccion || "",
          planId: ""
        });
      } else {
        reset({ nombre: "", apellido: "", dni: "", telefono: "", correo: "", direccion: "", planId: "" });
      }
    }
  }, [isOpen, initialData, reset]);

  const onFormSubmit = async (data: UserFormValues) => {
    if (!isEditing && !data.planId) {
      setError("planId", { type: "manual", message: "Selecciona un plan." });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error: any) {
      alert(error.message || "Error al procesar la solicitud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Editar Miembro" : "Registrar Nuevo Miembro"}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">Nombre</label>
            <Input {...register("nombre")} placeholder="Ej. Carlos" />
            {errors.nombre && <p className="text-alert text-xs mt-1">{errors.nombre.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">Apellido</label>
            <Input {...register("apellido")} placeholder="Ej. Mendoza" />
            {errors.apellido && <p className="text-alert text-xs mt-1">{errors.apellido.message}</p>}
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">DNI</label>
          <Input {...register("dni")} placeholder="Ej. 45283910" />
          {errors.dni && <p className="text-alert text-xs mt-1">{errors.dni.message}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">Teléfono</label>
            <Input {...register("telefono")} placeholder="Opcional" />
            {errors.telefono && <p className="text-alert text-xs mt-1">{errors.telefono.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">Correo Electrónico</label>
            <Input type="email" {...register("correo")} placeholder="ejemplo@correo.com" />
            {errors.correo && <p className="text-alert text-xs mt-1">{errors.correo.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">Dirección</label>
          <Input {...register("direccion")} placeholder="Opcional" />
        </div>

        {!isEditing && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-text-muted tracking-widest uppercase font-mono">Plan Inicial</label>
            <div className="relative">
              <select 
                {...register("planId")}
                className="flex h-11 w-full rounded-md border border-[#222222] bg-[#111111] px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all appearance-none cursor-pointer hover:border-[#333333]"
              >
                <option value="" disabled className="bg-[#111111] text-text-muted">Selecciona un plan...</option>
                {plans.map(plan => (
                  <option key={plan.idPlan} value={plan.idPlan} className="bg-[#111111] text-white py-2">
                    {plan.nombrePlan} - S/{plan.precio} ({plan.duracionMeses} mes{plan.duracionMeses > 1 ? 'es' : ''})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-muted">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            {errors.planId && <p className="text-alert text-xs mt-1">{errors.planId.message}</p>}
          </div>
        )}

        <div className="pt-6 flex justify-end gap-3 border-t border-[#222222] mt-6">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting} className="hover:bg-[#111111] hover:text-white">
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting} className="min-w-[140px]">
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
                Procesando...
              </span>
            ) : "Guardar Miembro"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
