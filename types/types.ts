export type UserRole = 'admin' | 'user';

export enum ReservationStatus {
  RESERVED = 'reserved',
  PENDING = 'pending',
  CANCELLED = 'cancelled'
}

export type Reservation = {
  userId: string;
  reservedAt: Date;
  status: ReservationStatus;
}

type NotificationType = 'email' | 'reservation' | 'account'

export type Notification = {
  _id: string;
  type?: NotificationType; // defines the icon
  title: string;
  description: string;
  read: boolean; // false by default
  createdAt?: Date;
}