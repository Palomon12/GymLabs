"use client";

import { useState, useEffect } from "react";
import { DashboardStats } from "@/types/dashboard";
import { Card } from "@/components/ui/card";
import { Users, DollarSign, Activity, TrendingUp, Calendar } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";

import { API_BASE_URL } from "@/config/api";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      if (!user) return;
      if (!stats) setLoading(true);
      else setIsFetching(true);
      
      try {
        const url = `${API_BASE_URL}/dashboard/stats?mes=${selectedMonth}&anio=${selectedYear}${user.idEmpresa ? `&empresaId=${user.idEmpresa}` : ''}`;
        const response = await fetch(url, {
          headers: { 'Authorization': `Bearer ${user.token}` }
        });
        if (response.ok && isMounted) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
          setIsFetching(false);
        }
      }
    };

    fetchStats();

    return () => {
      isMounted = false;
    };
  }, [selectedMonth, selectedYear, user]);

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#111111] border-t-primary rounded-full animate-spin" />
          <p className="text-text-muted font-mono text-sm uppercase tracking-widest animate-pulse">Cargando Métricas...</p>
        </div>
      </div>
    );
  }

  // Meta Mensual Fija (Visual)
  const metaMensual = 10000;
  const progresoMeta = stats ? Math.min((stats.ingresosMes / metaMensual) * 100, 100) : 0;
  
  // Clase CSS dinámica para el efecto de difuminado al cambiar fechas
  const blurClass = isFetching ? "opacity-40 blur-sm scale-[0.98] transition-all duration-500 ease-in-out pointer-events-none" : "opacity-100 blur-0 scale-100 transition-all duration-700 ease-out";

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-2">Panel Operativo</h2>
          <p className="text-text-muted font-mono text-sm">Resumen financiero y de usuarios del gimnasio.</p>
        </div>
        
        {/* Custom Premium Selectors */}
        <div className="flex bg-[#111111] border border-[#222222] p-1 rounded-lg shadow-lg">
          <div className="relative flex items-center">
            <Calendar className="w-4 h-4 text-text-muted absolute left-3 pointer-events-none" />
            <select 
              className="h-10 appearance-none bg-transparent pl-9 pr-8 text-sm text-white font-medium focus:outline-none cursor-pointer border-r border-[#222222] hover:text-primary transition-colors"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              <option className="bg-[#111111] text-white" value={1}>Enero</option>
              <option className="bg-[#111111] text-white" value={2}>Febrero</option>
              <option className="bg-[#111111] text-white" value={3}>Marzo</option>
              <option className="bg-[#111111] text-white" value={4}>Abril</option>
              <option className="bg-[#111111] text-white" value={5}>Mayo</option>
              <option className="bg-[#111111] text-white" value={6}>Junio</option>
              <option className="bg-[#111111] text-white" value={7}>Julio</option>
              <option className="bg-[#111111] text-white" value={8}>Agosto</option>
              <option className="bg-[#111111] text-white" value={9}>Septiembre</option>
              <option className="bg-[#111111] text-white" value={10}>Octubre</option>
              <option className="bg-[#111111] text-white" value={11}>Noviembre</option>
              <option className="bg-[#111111] text-white" value={12}>Diciembre</option>
            </select>
          </div>
          <select 
            className="h-10 appearance-none bg-transparent px-4 text-sm text-white font-medium focus:outline-none cursor-pointer hover:text-primary transition-colors"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            <option className="bg-[#111111] text-white" value={2025}>2025</option>
            <option className="bg-[#111111] text-white" value={2026}>2026</option>
            <option className="bg-[#111111] text-white" value={2027}>2027</option>
          </select>
        </div>
      </div>

      {/* KPI Cards (Asymmetrical Grid) */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 ${blurClass}`}>
        
        {/* Main Revenue Card (Takes up 2 columns on medium screens) */}
        <Card className="md:col-span-2 p-8 bg-surface/40 backdrop-blur-md border-[#222222] flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 group-hover:bg-primary/10 transition-colors duration-500" />
          
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-xs font-bold text-text-muted tracking-[0.2em] uppercase mb-1">Ingresos Totales (Mes)</p>
              <h3 className="text-5xl lg:text-6xl font-bold text-white tracking-tighter">
                S/{stats?.ingresosMes?.toFixed(2) || "0.00"}
              </h3>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary group-hover:scale-110 transition-transform duration-500">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="mt-12 relative z-10">
            <div className="flex justify-between text-xs text-text-muted font-mono mb-3 uppercase tracking-wider">
              <span>Progreso hacia Meta (S/{metaMensual})</span>
              <span className="text-primary font-bold">{progresoMeta.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-[#111111] rounded-full h-2 overflow-hidden shadow-inner border border-[#222222]">
              <div 
                className="bg-gradient-to-r from-primary/50 to-primary h-full rounded-full transition-all duration-1000 relative" 
                style={{ width: `${progresoMeta}%` }}
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
              </div>
            </div>
          </div>
        </Card>

        {/* Secondary KPI Container (Stack of 2 smaller cards) */}
        <div className="flex flex-col gap-6">
          <Card className="p-6 bg-surface/40 backdrop-blur-md border-[#222222] flex-1 flex flex-col justify-center hover:-translate-y-1 transition-all duration-300 group hover:border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-text-muted tracking-[0.2em] uppercase">Total Clientes</p>
              <Users className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-4xl font-bold text-white">{stats?.totalClientes}</h3>
            <div className="flex items-center gap-1 mt-2 text-primary text-xs font-mono">
              <TrendingUp className="w-3 h-3" /> <span>Estable</span>
            </div>
          </Card>

          <Card className="p-6 bg-surface/40 backdrop-blur-md border-[#222222] flex-1 flex flex-col justify-center hover:-translate-y-1 transition-all duration-300 group hover:border-primary/30">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold text-text-muted tracking-[0.2em] uppercase">Membresías Activas</p>
              <Activity className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
            </div>
            <h3 className="text-4xl font-bold text-white">{stats?.membresiasActivas}</h3>
            <div className="flex items-center gap-1 mt-2 text-text-muted text-xs font-mono">
              <span>Actualizadas hoy</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Charts */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${blurClass}`}>
        
        {/* Bar Chart */}
        <Card className="p-6 md:p-8 bg-surface/30 backdrop-blur-sm border-[#222222] hover:border-[#333333] transition-colors duration-500">
          <h3 className="text-sm font-bold tracking-widest text-white uppercase mb-8">Evolución de Ingresos</h3>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.graficoIngresos}>
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c3f400" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#c3f400" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1c" vertical={false} />
                <XAxis dataKey="name" stroke="#666666" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#666666" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `S/${value}`} dx={-10} />
                <Tooltip 
                  cursor={{fill: '#1a1a1a'}} 
                  contentStyle={{ backgroundColor: '#000000', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#c3f400' }}
                />
                <Bar dataKey="value" fill="url(#colorIngresos)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Area Chart */}
        <Card className="p-6 md:p-8 bg-surface/30 backdrop-blur-sm border-[#222222] hover:border-[#333333] transition-colors duration-500">
          <h3 className="text-sm font-bold tracking-widest text-white uppercase mb-8">Nuevos Clientes</h3>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.graficoNuevosClientes}>
                <defs>
                  <linearGradient id="colorClientes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#abd600" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#abd600" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1c" vertical={false} />
                <XAxis dataKey="name" stroke="#666666" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#666666" fontSize={11} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000000', border: '1px solid #333', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  itemStyle={{ color: '#abd600' }}
                />
                <Area type="monotone" dataKey="value" stroke="#abd600" strokeWidth={3} fillOpacity={1} fill="url(#colorClientes)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
