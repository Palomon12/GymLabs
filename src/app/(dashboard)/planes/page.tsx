"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, Plus } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface Plan {
  idPlan: number;
  nombrePlan: string;
  descripcion: string;
  duracion: string;
  precio: number;
}

export default function PlansPage() {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8081/api/planes")
      .then(res => res.json())
      .then(data => {
        setPlanes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching planes:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">Configuración de Planes</h2>
          <p className="text-text-muted">Administra las suscripciones, precios y características disponibles para los miembros.</p>
        </div>
        <div>
          <Button variant="primary" className="h-9">
            <Plus className="w-4 h-4 mr-2" /> Crear Nuevo Plan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center py-10 text-text-muted">Cargando planes...</div>
        ) : planes.length === 0 ? (
          <div className="col-span-3 text-center py-10 text-text-muted">No se encontraron planes en la base de datos.</div>
        ) : (
          planes.map((plan) => {
            const isPremium = plan.nombrePlan.toLowerCase().includes("premium");
            
            // Basic parsing of descriptions if they were comma-separated
            const features = plan.descripcion ? plan.descripcion.split(',') : [];

            return (
              <Card 
                key={plan.idPlan} 
                className={`bg-surface relative overflow-hidden flex flex-col ${isPremium ? "border-primary shadow-[0_0_30px_rgba(195,244,0,0.05)]" : ""}`}
              >
                {isPremium && (
                  <div className="absolute top-0 right-8 bg-primary text-[#283500] px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-b-md">
                    Popular
                  </div>
                )}
                
                <div className={`p-6 flex-1 ${isPremium ? 'pt-8' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{plan.nombrePlan}</h3>
                    <Badge variant="active" className={`px-3 ${!isPremium ? 'bg-surface-hover text-text-muted' : ''}`}>Activo</Badge>
                  </div>
                  <div className="inline-block px-2 py-1 bg-[#121212] rounded text-xs text-text-muted font-mono mb-6">
                    ID: PLN-{plan.idPlan.toString().padStart(3, '0')}
                  </div>
                  
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-bold text-primary">${plan.precio}</span>
                    <span className="text-text-muted text-sm">/ {plan.duracion}</span>
                  </div>

                  <div className="h-px w-full bg-border mb-8" />

                  <ul className="space-y-4 mb-8">
                    {features.length > 0 ? (
                      features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                          <span className="text-sm text-text-main">{feature.trim()}</span>
                        </li>
                      ))
                    ) : (
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-sm text-text-main">Plan básico incluido</span>
                      </li>
                    )}
                  </ul>
                </div>
                <div className="p-6 pt-0 mt-auto">
                  <Button variant={isPremium ? "primary" : "secondary"} className="w-full text-xs tracking-widest font-mono uppercase">
                    Editar Plan
                  </Button>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Performance Table */}
      <Card className="bg-surface overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-semibold">Rendimiento de Planes (30 Días)</h3>
          <button className="text-text-muted hover:text-text-main">
            •••
          </button>
        </div>
        <div className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#121212] hover:bg-[#121212]">
                <TableHead>Plan</TableHead>
                <TableHead>Suscripciones Activas</TableHead>
                <TableHead>Nuevos Ingresos</TableHead>
                <TableHead>Tasa de Retención</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                   <TableCell colSpan={4} className="text-center py-4 text-text-muted">Cargando...</TableCell>
                </TableRow>
              ) : (
                planes.map((plan) => (
                  <TableRow key={plan.idPlan}>
                    <TableCell className="font-semibold">{plan.nombrePlan}</TableCell>
                    <TableCell>{Math.floor(Math.random() * 1000)}</TableCell>
                    <TableCell className="text-primary font-medium flex items-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mr-1"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                      +{Math.floor(Math.random() * 50)}
                    </TableCell>
                    <TableCell>{Math.floor(Math.random() * 20) + 80}%</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
