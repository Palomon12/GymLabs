import { useState, useMemo } from "react";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reset page when data changes significantly (e.g. searching)
  useMemo(() => setCurrentPage(1), [pagos.length]);

  const totalPages = Math.ceil(pagos.length / itemsPerPage);
  
  const currentPagos = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return pagos.slice(start, start + itemsPerPage);
  }, [pagos, currentPage, itemsPerPage]);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-8 h-8 border-4 border-[#333] border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
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
            {currentPagos.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-8 text-text-muted">
                  No se encontraron pagos registrados.
                </td>
              </tr>
            ) : (
              currentPagos.map((p) => {
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
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {!loading && pagos.length > 0 && (
        <div className="p-4 border-t border-[#222] flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <span>Mostrando</span>
            <div className="relative">
              <select 
                value={itemsPerPage} 
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-8 rounded-md border border-[#333] bg-[#1A1A1A] px-3 pr-8 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer transition-colors"
              >
                <option value={10}>10</option>
                <option value={30}>30</option>
                <option value={50}>50</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-muted">
                <svg className="h-3 w-3 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
            <span>de {pagos.length} pagos</span>
          </div>
          
          <div className="flex gap-2">
            <button 
              className="flex items-center justify-center h-8 w-8 rounded-md border border-[#333] bg-transparent text-text-muted hover:text-white hover:bg-[#333]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              &lt;
            </button>
            <button 
              className="flex items-center justify-center h-8 w-8 rounded-md border border-[#333] bg-transparent text-text-muted hover:text-white hover:bg-[#333]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={currentPage >= totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
