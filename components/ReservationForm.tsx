"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'react-query';
import ky from 'ky';
import { Reservation, ScheduleProps } from '@/types/types';
import Calendar from './Calendar';

function ReservationForm() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const pricePerHour = 20000; // Precio por hora

  const router = useRouter();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const oneWeekFromToday = new Date(today);
  oneWeekFromToday.setDate(today.getDate() + 6);

  // Función para obtener las reservas de una fecha específica usando React Query
  const fetchReservation = async (date: string): Promise<Reservation> => {
    try {
      const reservation = await ky.get(`/api/reservations/${date}`).json();
      return reservation as Reservation;
    } catch (error) {
      throw new Error('No se encontró la reserva.');
    }
  };

  // Hook de React Query que se ejecuta cuando `selectedDate` cambia
  const { data: reservation, error, isLoading, refetch } = useQuery<Reservation, Error>(
    ['reservation', selectedDate],
    () => fetchReservation(selectedDate?.toISOString().split('T')[0] || ""),
    {
      enabled: !!selectedDate, // Solo si hay fecha seleccionada
      retry: false, // Desactiva los reintentos automáticos en caso de error
      staleTime: 0, // No cachear los datos para que siempre se vuelva a consultar
      refetchOnWindowFocus: true, // Refetch cada vez que la ventana obtiene el foco
      cacheTime: 0, // No guardar cache entre visitas para asegurarte de que siempre está actualizado
    }
  );

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setSelectedHour(""); // Reinicia la hora seleccionada
    setTotalAmount(0);    // Reinicia el monto total a pagar
    refetch();
  };

  const handleHourClick = (hour: string, isOccupied: boolean) => {
    if (!isOccupied) {
      setSelectedHour(hour);
      setTotalAmount(pricePerHour);
    }
  };

  const handlePayment = () => {
    if (selectedDate && selectedHour) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Formato de fecha yyyy-mm-dd
      router.push(`/payment-confirmation?date=${formattedDate}&hour=${selectedHour}&amount=${totalAmount}`);
    }
  };

  return (
    <div className="reservation-form p-6 mx-auto w-full max-w-screen-md">
      <span className='text-3xl font-medium text-center block my-3'>Realizar una reserva</span>

      <div className="flex flex-col gap-2 justify-start items-start my-5">
        <Calendar
          selected={selectedDate}
          onDateChange={handleDateChange}
          dateFormat="yyyy-MM-dd" // Cambia a este formato
          minDate={today}
          maxDate={oneWeekFromToday}
          selectedClass='bg-blue-500 text-white' // Clase para el día seleccionado
          dayClass='text-black dark:text-neutral-200 dark:hover:bg-neutral-700 hover:bg-gray-300' // Clase para los días hábiles
        />
      </div>

      {/* Horarios de la reserva */}
      <div className="flex flex-col gap-2 justify-start items-start mb-3">
        <div className="grid grid-cols-3 gap-2 w-full">
          {/* renderizar horarios */}
          {reservation && reservation.schedule.map((schedule: ScheduleProps) => (
            <button
              key={schedule.hour}
              className={`
                w-full h-12 rounded-lg 
                ${schedule.occupied
                  ? 'bg-red-500 text-white cursor-not-allowed opacity-60'
                  : 'bg-gray-200 md:hover:bg-gray-300 dark:bg-neutral-800 md:dark:hover:bg-neutral-700 active:brightness-90 duration-75'} 
                ${selectedHour === schedule.hour ? 'border-2 border-blue-500' : ''}
              `}
              onClick={() => handleHourClick(schedule.hour, schedule.occupied)}
              disabled={schedule.occupied}
            >
              {schedule.hour}
            </button>
          ))}
          {/* estado de carga */}
          {isLoading && <>
            {Array.from({ length: 11 }).map((_, i) => (
              <span key={i} className='w-full h-12 rounded-lg dark:bg-neutral-600 bg-gray-300 animate-pulse'></span>
            ))}
          </>}
        </div>
      </div>

      {/* mensaje de error */}
      {error && <span className='text-red-700'>{error.message}</span>}

      {selectedDate && selectedHour && <div className='my-3'>
        <span className='text-lg dark:text-neutral-400 text-gray-600 mb-3 block'>Estás reservando 1 hora de Fútbol 5 para el {selectedDate instanceof Date ? selectedDate.toLocaleDateString('es-AR', { weekday: 'long', month: 'long', day: 'numeric' }) : ''} a las {selectedHour}hs</span>
        <span className='text-lg dark:text-neutral-400 text-gray-600 block'>Monto total a pagar: ${totalAmount}</span>
      </div>}

      <button
        onClick={handlePayment}
        className={`mt-4 w-full h-12 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50`}
        disabled={!selectedHour || totalAmount === 0}
      >
        Confirmar Reserva
      </button>
    </div>
  );
}

export default ReservationForm;