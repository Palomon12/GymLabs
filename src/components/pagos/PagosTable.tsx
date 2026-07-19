import { Pago } from "@/types/pago";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface PagosTableProps {
  pagos: Pago[];
  loading: boolean;
  onEdit: (pago: Pago) => void;
}

export function PagosTable({ pagos, loading, onEdit }: PagosTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-8 h-8 border-4 border-[#333] border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (pagos.length === 0) {
    return (
      <div className="text-center p-8 text-text-muted">
        No se encontraron pagos registrados.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-[#111] border-b border-[#222]">
          <tr>
            <th className="px-6 py-4 font-semibold text-text-muted">Cliente</th>
            <th className="px-6 py-4 font-semibold text-text-muted">Plan / Membresía</th>
            <th className="px-6 py-4 font-semibold text-text-muted">Fecha de Pago</th>
            <th className="px-6 py-4 font-semibold text-text-muted">Método</th>
            <th className="px-6 py-4 font-semibold text-text-muted">Monto</th>
            <th className="px-6 py-4 font-semibold text-text-muted">Estado</th>
            <th className="px-6 py-4 font-semibold text-text-muted text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#222]">
          {pagos.map((p) => {
            const clienteName = p.membresia?.cliente ? `${p.membresia.cliente.nombre} ${p.membresia.cliente.apellido}` : "Desconocido";
            const planName = p.membresia?.plan?.nombrePlan || "N/A";
            
            return (
              <tr key={p.idPago} className="hover:bg-[#1A1A1A] transition-colors group">
                <td className="px-6 py-4 font-medium text-white">{clienteName}</td>
                <td className="px-6 py-4 text-text-muted">{planName}</td>
                <td className="px-6 py-4 text-text-muted">{new Date(p.fechaPago + 'T00:00:00').toLocaleDateString()}</td>
                <td className="px-6 py-4 text-text-muted">{p.metodoPago}</td>
                <td className="px-6 py-4 font-bold text-white">S/{p.monto.toFixed(2)}</td>
                <td className="px-6 py-4">
                  {p.estadoPago === 'COMPLETADO' ? (
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Completado</Badge>
                  ) : p.estadoPago === 'PENDIENTE' ? (
                    <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">Pendiente</Badge>
                  ) : (
                    <Badge className="bg-red-500/10 text-red-400 border-red-500/20">Cancelado</Badge>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => onEdit(p)} 
                      className="text-text-muted hover:text-white h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
