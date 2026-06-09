"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Users, DollarSign, Activity } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

interface ChartData {
  name: string;
  value: number;
}

interface DashboardStats {
  totalClientes: number;
  ingresosMes: number;
  membresiasActivas: number;
  graficoIngresos: ChartData[];
  graficoNuevosClientes: ChartData[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8081/api/dashboard/stats")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching dashboard stats:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center text-text-muted">Cargando métricas...</div>;
  }

  // Meta Mensual Fija (Visual)
  const metaMensual = 10000;
  const progresoMeta = stats ? Math.min((stats.ingresosMes / metaMensual) * 100, 100) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h2>
        <p className="text-text-muted">Métricas y rendimiento de tu gimnasio en tiempo real.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-surface border-border flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-text-muted tracking-wide uppercase">Ingresos del Mes</p>
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-bold text-text-main">${stats?.ingresosMes.toFixed(2)}</h3>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-xs text-text-muted">
              <span>Meta: ${metaMensual}</span>
              <span>{progresoMeta.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-[#1c1c1c] rounded-full h-2 overflow-hidden">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-1000" 
                style={{ width: `${progresoMeta}%` }}
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-surface border-border flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-text-muted tracking-wide uppercase">Total Clientes</p>
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-bold text-text-main">{stats?.totalClientes}</h3>
          </div>
          <p className="text-xs text-text-muted mt-4">Usuarios registrados activos.</p>
        </Card>

        <Card className="p-6 bg-surface border-border flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-text-muted tracking-wide uppercase">Membresías Activas</p>
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div className="mt-4">
            <h3 className="text-4xl font-bold text-text-main">{stats?.membresiasActivas}</h3>
          </div>
          <p className="text-xs text-text-muted mt-4">Planes actualmente en curso.</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-surface border-border">
          <h3 className="text-lg font-semibold mb-6">Evolución de Ingresos</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.graficoIngresos}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  cursor={{fill: '#2a2a2a'}} 
                  contentStyle={{ backgroundColor: '#131313', border: '1px solid #353534', borderRadius: '8px' }} 
                />
                <Bar dataKey="value" fill="#c3f400" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-surface border-border">
          <h3 className="text-lg font-semibold mb-6">Nuevos Clientes</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.graficoNuevosClientes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#131313', border: '1px solid #353534', borderRadius: '8px' }} 
                />
                <Line type="monotone" dataKey="value" stroke="#abd600" strokeWidth={3} dot={{ fill: '#c3f400', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
