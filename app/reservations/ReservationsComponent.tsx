'use client';

import React from 'react';
import ky from 'ky';
import { useQuery } from 'react-query';
import { useSession } from 'next-auth/react';
import { ScheduleProps, ReservationStatus } from '@/types/types';
import DropdownMenu from '@/components/DropdownMenu';
import { PiDotsThreeBold } from 'react-icons/pi';
import { BsClipboard2X } from "react-icons/bs";
import { differenceInHours, differenceInMinutes, differenceInDays } from 'date-fns'; // Librería para calcular tiempos

// info de la reserva en el array 'reservations' del usuario
interface UserReservation {
  reservationDay: string,
  scheduleId: string,
  createdAt: string,
};

const ReservationsComponent = () => {
  const { data: session } = useSession(); // Obtenemos los datos de la sesión (incluyendo userId)

  const fetchUserReservations = async (): Promise<UserReservation[]> => {
    try {
      const reservations = await ky.get(`/api/users/${session?.user?.id}/reservations`).json();
      return reservations as UserReservation[];
    } catch (error) {
      console.log(error);
      throw new Error('No se encontraron reservas para el usuario.');
    }
  };

  // Mejoras en el useQuery
  const { data: reservations, error, isLoading } = useQuery<UserReservation[], Error>(
    ['userReservations', session?.user?.id],
    fetchUserReservations,
    {
      enabled: !!session?.user?.id, // Solo se ejecuta si existe el userId
      staleTime: 1000 * 60 * 5, // Los datos se consideran frescos por 5 minutos
      cacheTime: 1000 * 60 * 10, // Mantener en caché los datos por 10 minutos
      retry: 2, // Intentar dos veces en caso de fallo
      refetchOnWindowFocus: false, // No volver a buscar cada vez que se enfoca la ventana
    }
  );

  return (
    <div className="w-full max-w-screen-lg mx-auto p-4">
      {isLoading ? (
        <div className='w-full p-4 flex justify-center items-center'>
          <span className='buttonLoader'></span>
        </div>
      ) : error ? (
        <p className="text-red-500">Error al cargar las reservas: {error.message}</p>
      ) : reservations && reservations.length > 0 ? (
        <UserReservations reservations={reservations} />
      ) : (
        <div className="p-4 flex justify-center items-center w-full h-full flex-col gap-5">
          <BsClipboard2X size={50} className='text-black dark:text-neutral-500' />
          <span className='text-black dark:text-neutral-500 opacity-80'>No hay reservaciones hechas</span>
        </div>
      )}
    </div>
  );
};

export default ReservationsComponent;

const UserReservations = ({ reservations }: { reservations: UserReservation[] }) => {
  return (
    <>
      {reservations.map((reservation, i) => (
        <ReservationCard key={i} reservation={reservation} />
      ))}
    </>
  );
};

// Componente Card de la reserva
const ReservationCard: React.FC<{ reservation: UserReservation }> = React.memo(({ reservation }) => {
  // Función para obtener el horario de la reserva
  const fetchReservationSchedule = async (): Promise<ScheduleProps> => {
    try {
      const res = await ky.get(`/api/reservations/${reservation.reservationDay}/${reservation.scheduleId}`).json();
      return res as ScheduleProps;
    } catch (error) {
      console.log('Error al obtener el horario:', error);
      throw error;
    }
  };

  // useQuery con optimizaciones
  const { data: schedule, isLoading, isError, error } = useQuery<ScheduleProps, Error>(
    ['reservationSchedule', reservation.reservationDay, reservation.scheduleId],
    fetchReservationSchedule,
    {
      staleTime: 1000 * 60 * 5, // Datos frescos por 5 minutos
      cacheTime: 1000 * 60 * 10, // Cache por 10 minutos
      retry: 1, // Reintento en caso de error
      refetchOnWindowFocus: true, // Evitar consultas extra
    }
  );

  // Función para obtener el tiempo transcurrido desde la creación de la reserva
  const getTimeElapsed = () => {
    const now = new Date();
    const createdAt = new Date(reservation.createdAt);

    const hours = differenceInHours(now, createdAt);
    const minutes = differenceInMinutes(now, createdAt);
    const days = differenceInDays(now, createdAt);

    if (days > 0) return `Reservado hace ${days} día${days > 1 ? 's' : ''}`;
    if (hours > 0) return `Reservado hace ${hours} hora${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `Reservado hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    return 'Reservado hace un momento';
  };

  // Clase de estilo según el estado de la reserva
  const getStatusClassName = (status: ReservationStatus) => {
    if (status === 'pending') return 'bg-orange-600';
    if (status === 'available') return 'bg-emerald-500';
    if (status === 'canceled') return 'bg-red-500';
    if (status === 'confirmed') return 'bg-green-500';
  };

  return (
    <div className="relative p-4 rounded-lg mb-4 dark:bg-neutral-800 bg-white shadow-md">
      <div>
        {isLoading && <p>Cargando horario...</p>}
        {isError && <p className="text-red-500">Error al cargar el horario: {error?.message}</p>}
        {schedule && (
          <div>
            <p>{getTimeElapsed()}</p>
            <p><strong>Fecha:</strong> {reservation.reservationDay}</p>
            <p><strong>Horario:</strong> {schedule.hour}</p>
            <p><strong>Estado:</strong> <span className={`py-1 px-2 text-sm rounded-lg ${getStatusClassName(schedule.status)}`}>{schedule.status}</span></p>
          </div>
        )}
      </div>

      {/* DropdownMenu options */}
      <div className="absolute top-2 right-2">
        <DropdownMenu trigger={<PiDotsThreeBold className="cursor-pointer" size={23} />}>
          <ul className="py-1">
            <li className="p-2 itemStyle">Eliminar reserva</li>
            <li className="p-2 itemStyle">Cancelar reserva</li>
          </ul>
        </DropdownMenu>
      </div>
    </div>
  );
}, (prevProps, nextProps) => prevProps.reservation.scheduleId === nextProps.reservation.scheduleId);