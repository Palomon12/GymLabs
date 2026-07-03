import { useState, useEffect } from 'react';
import { DashboardStats } from '@/types/dashboard';
import { API_BASE_URL } from '@/config/api';

export const useDashboard = (month: number, year: number) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      // Solo mostrar pantalla de carga completa si no hay datos iniciales
      if (!stats) setLoading(true);
      else setIsFetching(true);
      
      try {
        const response = await fetch(`${API_BASE_URL}/dashboard/stats?mes=${month}&anio=${year}`);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  return { stats, loading, isFetching };
};
