// user type

export interface UserState {
  _id: string | null;
  fullname: string | null;
  username: string | null;
  email: string | null;
  color: string | null;
  role: UserRole | null;
  createdAt: string | null;
  updatedAt: string | null;
}

// 


export type UserRole = 'admin' | 'user';

export type ReservationStatus = 'available' | 'pending' | 'canceled' | 'confirmed'

// Reserva que hará un usuario
export interface Schedule {
  hour: string;
  occupied: boolean;
  status: ReservationStatus;
  reservedBy: string; // user id 
}

export interface Reservation {
  _id: string;
  day: string;
  schedule: Schedule[];
  createdAt: string;
  __v: number;
}

// notification

export type NotificationType = 'email' | 'reservation' | 'account'

export type NotificationProps = {
  _id: string;
  type?: NotificationType; // defines the icon
  title: string;
  message: string;
  seen: boolean; // false by default
  createdAt?: Date;
  updatedAt?: Date;
}

// navbar

export type NavLinkProps = {
  title: string;
  route: string;
}