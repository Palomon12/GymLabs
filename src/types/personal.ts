import { Rol } from './auth';

export interface Personal {
  idPersonal: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  dni?: string;
  activo: boolean;
  rol: {
    idRol: number;
    nombreRol: Rol;
  };
  empresa: {
    idEmpresa: number;
  };
}
