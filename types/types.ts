export type UserRole = 'admin' | 'user';

// reservation
export interface ReservationProps {
  userId: string;       // ID del usuario que hace la reserva
  selectedDate: Date;   // Fecha de la reserva
  startTime: string;    // Hora de inicio
  endTime: string;      // Hora de fin
  totalHours: number;   // Total de horas reservadas
  totalAmount: number;  // Monto total a pagar
}

// notification

type NotificationType = 'email' | 'reservation' | 'account'

export type Notification = {
  _id: string;
  type?: NotificationType; // defines the icon
  title: string;
  description: string;
  read: boolean; // false by default
  createdAt?: Date;
}

// navbar

export type NavLinkProps = {
  title: string;
  route: string;
}