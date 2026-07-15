export type Rol = 'ADMIN' | 'RECEPCIONISTA';

export interface UserAuth {
  idPersonal: number;
  nombre: string;
  apellido: string;
  correo: string;
  rol: Rol;
}

// Para simular la autenticación por ahora
export const mockAdmin: UserAuth = {
  idPersonal: 1,
  nombre: "Josué",
  apellido: "Admin",
  correo: "admin@gymlabs.com",
  rol: 'ADMIN'
};

export const mockRecepcionista: UserAuth = {
  idPersonal: 2,
  nombre: "Ana",
  apellido: "Recepción",
  correo: "recepcion@gymlabs.com",
  rol: 'RECEPCIONISTA'
};
