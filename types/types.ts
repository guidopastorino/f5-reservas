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
export interface ScheduleProps {
  hour: string;
  occupied: boolean;
  status: ReservationStatus;
  reservedBy: string; // user id 
  _id?: string
}

export interface Reservation {
  _id: string;
  day: string;
  schedule: ScheduleProps[];
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
  createdAt: string;
  updatedAt?: string;
}

// navbar

export type NavLinkProps = {
  title: string;
  route: string;
}


// review
// Definir el tipo para una Review
export interface ReviewProps {
  _id: string;
  fullname: string;
  username: string;
  review: string;       
  stars: number;      
  createdAt: Date;
  updatedAt?: Date;   
}