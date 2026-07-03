"use client";

import { useState } from "react";
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


import { useDashboard } from "@/hooks/useDashboard";

export default function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const { stats, loading, isFetching } = useDashboard(selectedMonth, selectedYear);

  if (loading) {
    return <div className="flex h-[50vh] items-center justify-center text-text-muted">Cargando métricas...</div>;
  }

  // Meta Mensual Fija (Visual)
  const metaMensual = 10000;
  const progresoMeta = stats ? Math.min((stats.ingresosMes / metaMensual) * 100, 100) : 0;
  
  // Clase CSS dinámica para el efecto de difuminado
  const blurClass = isFetching ? "opacity-50 blur-[2px] transition-all duration-500 ease-in-out cursor-wait pointer-events-none" : "opacity-100 blur-0 transition-all duration-500 ease-in-out";

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">Dashboard</h2>
          <p className="text-text-muted">Métricas y rendimiento de tu gimnasio en tiempo real.</p>
        </div>
        <div className="flex gap-2">
          <select 
            className="h-10 rounded-md border border-border bg-surface px-3 text-sm text-text-main focus:outline-none focus:ring-1 focus:ring-primary"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            <option value={1}>Enero</option>
            <option value={2}>Febrero</option>
            <option value={3}>Marzo</option>
            <option value={4}>Abril</option>
            <option value={5}>Mayo</option>
            <option value={6}>Junio</option>
            <option value={7}>Julio</option>
            <option value={8}>Agosto</option>
            <option value={9}>Septiembre</option>
            <option value={10}>Octubre</option>
            <option value={11}>Noviembre</option>
            <option value={12}>Diciembre</option>
          </select>
          <select 
            className="h-10 rounded-md border border-border bg-surface px-3 text-sm text-text-main focus:outline-none focus:ring-1 focus:ring-primary"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            <option value={2025}>2025</option>
            <option value={2026}>2026</option>
            <option value={2027}>2027</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-surface border-border flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-text-muted tracking-wide uppercase">Ingresos del Mes</p>
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <div className={`mt-4 ${blurClass}`}>
            <h3 className="text-4xl font-bold text-text-main">${stats?.ingresosMes?.toFixed(2) || "0.00"}</h3>
          </div>
          <div className={`mt-4 space-y-2 ${blurClass}`}>
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
          <div className={`mt-4 ${blurClass}`}>
            <h3 className="text-4xl font-bold text-text-main">{stats?.totalClientes}</h3>
          </div>
          <p className="text-xs text-text-muted mt-4">Usuarios registrados activos.</p>
        </Card>

        <Card className="p-6 bg-surface border-border flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-text-muted tracking-wide uppercase">Membresías Activas</p>
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div className={`mt-4 ${blurClass}`}>
            <h3 className="text-4xl font-bold text-text-main">{stats?.membresiasActivas}</h3>
          </div>
          <p className="text-xs text-text-muted mt-4">Planes actualmente en curso.</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-surface border-border">
          <h3 className="text-lg font-semibold mb-6">Evolución de Ingresos</h3>
          <div className={`h-[300px] w-full ${blurClass}`}>
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
          <div className={`h-[300px] w-full ${blurClass}`}>
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
