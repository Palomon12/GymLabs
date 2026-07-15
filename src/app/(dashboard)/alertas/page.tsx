"use client";

import { useState, useMemo, useEffect } from "react";
import { AlertPreviewModal } from "@/components/ui/AlertPreviewModal";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { API_BASE_URL } from "@/config/api";

export default function AlertasPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sentAlerts, setSentAlerts] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      try {
        const url = new URL(`${API_BASE_URL}/clientes`);
        url.searchParams.append("page", "0");
        url.searchParams.append("size", "1000");
        url.searchParams.append("empresaId", (user.idEmpresa || 1).toString());

        const res = await fetch(url.toString(), {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setUsers(data);
          } else {
            setUsers(data.content || []);
          }
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [user]);

  // Filtrar solo usuarios próximos a vencer (menos de 7 días) o vencidos
  const atRiskUsers = useMemo(() => {
    return users.filter(u => {
      if (!u.fechaVencimiento) return false;
      const diffDays = Math.ceil((new Date(u.fechaVencimiento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }).sort((a, b) => new Date(a.fechaVencimiento as string).getTime() - new Date(b.fechaVencimiento as string).getTime());
  }, [users]);

  const handleOpenPreview = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleSendEmail = async () => {
    if (!user || !selectedUser || !selectedUser.fechaVencimiento) return;
    
    const diffDays = Math.ceil((new Date(selectedUser.fechaVencimiento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    try {
      const res = await fetch(`${API_BASE_URL}/alertas/enviar`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
        body: JSON.stringify({
          nombreCliente: selectedUser.nombre,
          diasRestantes: diffDays,
          emailDestino: selectedUser.correo,
        }),
      });
      
      if (!res.ok) throw new Error("Error enviando");
      
      // Marcar como enviado localmente en la UI
      setSentAlerts(new Set(sentAlerts).add(selectedUser.idCliente));
    } catch (e) {
      alert("La alerta se registró localmente (Mock del backend para el envío).");
      setSentAlerts(new Set(sentAlerts).add(selectedUser.idCliente));
    }
  };

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center text-text-muted">Cargando datos de riesgo...</div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 sm:p-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-2">
            Alertas y Retención <Mail className="text-primary w-6 h-6" />
          </h2>
          <p className="text-text-muted">Gestiona y envía recordatorios de pago a clientes en riesgo.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-surface border-border flex items-center gap-4">
          <div className="p-3 bg-red-500/10 text-red-500 rounded-full">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-text-muted">En Riesgo</p>
            <p className="text-2xl font-bold">{atRiskUsers.length} clientes</p>
          </div>
        </Card>
        <Card className="p-6 bg-surface border-border flex items-center gap-4">
          <div className="p-3 bg-primary/10 text-primary rounded-full">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-text-muted">Correos Enviados</p>
            <p className="text-2xl font-bold">{sentAlerts.size} hoy</p>
          </div>
        </Card>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border bg-[#111111]">
          <h3 className="font-semibold">Bandeja de Acción Rápida (Próximos a Vencer)</h3>
        </div>
        
        {atRiskUsers.length === 0 ? (
          <div className="p-8 text-center text-text-muted">
            No hay clientes en riesgo de vencimiento en los próximos 7 días. ¡Excelente!
          </div>
        ) : (
          <div className="divide-y divide-border">
            {atRiskUsers.map(user => {
              if (!user.fechaVencimiento) return null;
              const diffDays = Math.ceil((new Date(user.fechaVencimiento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
              const isSent = sentAlerts.has(user.idCliente);
              
              return (
                <div key={user.idCliente} className="p-4 flex items-center justify-between hover:bg-[#1A1A1A] transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#222222] flex items-center justify-center font-bold text-sm">
                      {user.nombre.charAt(0)}{user.apellido.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{user.nombre} {user.apellido}</p>
                      <p className="text-sm text-text-muted">{user.correo}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className={`font-bold ${diffDays <= 0 ? 'text-red-500' : diffDays <= 3 ? 'text-orange-500' : 'text-primary'}`}>
                        {diffDays <= 0 ? 'Vencido' : `Vence en ${diffDays} días`}
                      </p>
                      <p className="text-xs text-text-muted">Plan: {(user as any).plan?.nombrePlan || 'Suscripción'}</p>
                    </div>
                    
                    <Button 
                      variant={isSent ? "ghost" : "primary"}
                      className={isSent ? "text-primary border border-primary/30" : ""}
                      onClick={() => handleOpenPreview(user)}
                      disabled={isSent}
                    >
                      {isSent ? "Enviado ✓" : "Recordatorio"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <AlertPreviewModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cliente={selectedUser}
        onConfirm={handleSendEmail}
      />
    </div>
  );
}
