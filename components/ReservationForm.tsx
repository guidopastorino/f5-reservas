"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from 'react-query';
import ky from 'ky';
import { Reservation, Schedule } from '@/types/types';
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
  const { data: reservation, error, isLoading, refetch } = useQuery<Reservation>(
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

      <div className="flex flex-col gap-2 justify-start items-start mb-3">
        <label htmlFor="date" className="text-gray-700 dark:text-white text-lg">Selecciona una fecha:</label>
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

      <div className="flex flex-col gap-2 justify-start items-start mb-3">
        <label htmlFor="hour" className="text-gray-700 dark:text-white text-lg">Selecciona una hora:</label>
        <div className="grid grid-cols-3 gap-2">
          {reservation && reservation.schedule.map((schedule: Schedule) => (
            <button
              key={schedule.hour}
              className={`w-full h-12 rounded-lg ${schedule.occupied ? 'bg-red-500 text-white' : 'bg-gray-200 hover:bg-gray-300'} ${selectedHour === schedule.hour ? 'border-2 border-blue-500' : ''}`}
              onClick={() => handleHourClick(schedule.hour, schedule.occupied)}
              disabled={schedule.occupied}
            >
              {schedule.hour}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 justify-start items-start mb-3">
        <span className="text-lg">Monto total a pagar: ${totalAmount}</span>
      </div>

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