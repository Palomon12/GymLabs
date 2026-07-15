export interface Empresa {
  idEmpresa: number;
  nombre: string;
  direccion?: string;
  telefono?: string;
  correoContacto?: string;
  logoUrl?: string;
  moneda: string; // Fijo en Soles (PEN o S/) según lo acordado
}
