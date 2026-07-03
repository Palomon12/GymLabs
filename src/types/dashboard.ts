export interface ChartData {
  name: string;
  value: number;
}

export interface DashboardStats {
  totalClientes: number;
  ingresosMes: number;
  membresiasActivas: number;
  graficoIngresos: ChartData[];
  graficoNuevosClientes: ChartData[];
}
