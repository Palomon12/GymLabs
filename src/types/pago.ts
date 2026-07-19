export interface Pago {
  idPago: number;
  fechaPago: string;
  monto: number;
  metodoPago: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA';
  estadoPago: 'PENDIENTE' | 'COMPLETADO' | 'CANCELADO';
  membresia?: {
    idMembresia: number;
    cliente: {
      idCliente: number;
      nombre: string;
      apellido: string;
      dni: string;
    };
    plan: {
      idPlan: number;
      nombrePlan: string;
    };
  };
}
