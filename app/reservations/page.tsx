'use client';

import useUser from '@/hooks/useUser'; // Hook personalizado si lo usas para obtener info del usuario
import { Reservation } from '@/types/types';
import React, { useState } from 'react';
import ky from 'ky';
import { useQuery } from 'react-query';
import { useSession } from 'next-auth/react';

// info de la reserva en el array 'reservations' del usuario
interface UserReservation {
  day: string;
  hour: string;
}

// Componente principal de la página de reservas
const Page = () => {
  const { data: session } = useSession(); // Obtenemos los datos de la sesión (incluyendo userId)

  // Función para obtener las reservas del usuario por userId
  const fetchUserReservations = async (): Promise<UserReservation[]> => {
    try {
      // Realizamos la llamada a la API usando el userId del usuario logueado
      const reservations = await ky.get(`/api/users/${session?.user?.id}/reservations`).json();
      return reservations as UserReservation[];
    } catch (error) {
      throw new Error('No se encontraron reservas para el usuario.');
    }
  };

  // Hook de React Query que se ejecuta para obtener las reservas del usuario
  const { data: reservations, error, isLoading, refetch } = useQuery<UserReservation[], Error>(
    ['userReservations', session?.user?.id],
    fetchUserReservations,
    {
      enabled: !!session?.user?.id,
      staleTime: 0, // No cachear los datos para que siempre se vuelva a consultar
      refetchOnWindowFocus: true, // Refetch cada vez que la ventana obtiene el foco
      cacheTime: 0, // No guardar cache entre visitas para asegurarte de que siempre está actualizado
    }
  );

  // Renderizar la página
  return (
    <div className="w-full border max-w-screen-lg mx-auto p-4">
      {isLoading ? (
        <div className='w-full p-4 flex justify-center items-center'>
          <span className='buttonLoader'></span>
        </div>
      ) : error ? (
        <p className="text-red-500">Error al cargar las reservas: {error.message}</p>
      ) : reservations && reservations.length > 0 ? (
        <UserReservations reservations={reservations} />
      ) : (
        <p>No hay reservaciones hechas todavía</p>
      )}
    </div>
  );
};

export default Page;

// Componente que recibe las reservas y las renderiza en forma de lista
const UserReservations = ({ reservations }: { reservations: UserReservation[] }) => {
  return (
    <div className="reservation-list">
      {reservations.map((reservation, i) => (
        <ReservationCard key={i} reservation={reservation} />
      ))}
    </div>
  );
};

// Componente para renderizar cada reserva en formato de tarjeta
const ReservationCard: React.FC<{ reservation: UserReservation }> = ({ reservation }) => {
  return (
    <div className="reservation-card border p-4 rounded-lg shadow-md mb-4">
      <p><strong>Fecha:</strong> {reservation.day}</p>
      <p><strong>Hora:</strong> {reservation.hour}</p>
    </div>
  );
};
