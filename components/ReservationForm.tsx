"use client";

import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/navigation';
import 'react-datepicker/dist/react-datepicker.css';
import { useQuery } from 'react-query';
import ky from 'ky';
import { Reservation, Schedule } from '@/types/types';

// Definir la interfaz de la respuesta


function ReservationForm() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHour, setSelectedHour] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const pricePerHour = 20000; // Precio por hora

  const router = useRouter();

  const today = new Date();
  const oneWeekFromToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);

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
  const { data: reservation, error, isLoading } = useQuery<Reservation>(
    ['reservation', selectedDate],
    () => fetchReservation(selectedDate?.toISOString().split('T')[0] || ""),
    {
      enabled: !!selectedDate, // Solo si hay fecha seleccionada
      staleTime: 5 * 60 * 1000, // Cache de 5 minutos para evitar llamadas frecuentes
      retry: false, // Desactiva los reintentos automáticos en caso de error
      refetchOnWindowFocus: false, // Evita refetch al volver a la ventana
    }
  );

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setSelectedHour(""); // Reinicia la hora seleccionada
    setTotalAmount(0);    // Reinicia el monto total a pagar
  };

  const handleHourClick = (hour: string, isOccupied: boolean) => {
    if (!isOccupied) {
      setSelectedHour(hour);
      setTotalAmount(pricePerHour); // Para simplificar, se supone que siempre es una hora.
    }
  };

  const handlePayment = () => {
    if (selectedDate && selectedHour) {
      const formattedDate = selectedDate.toISOString().split('T')[0]; // Formato de fecha yyyy-mm-dd
      router.push(`/payment-confirmation?date=${formattedDate}&hour=${selectedHour}&amount=${totalAmount}`);
    }
  };

  return (
    <div className="reservation-form p-6">
      <div className="form-group mb-4">
        <label htmlFor="date" className="text-gray-700 dark:text-white">Selecciona una fecha:</label>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          minDate={today}
          maxDate={oneWeekFromToday}
          inline
          className="formInput bg-gray-100 dark:bg-neutral-700 dark:text-white p-2 rounded mt-2"
          placeholderText="Elige una fecha"
        />
      </div>

      <div className="form-group mb-4">
        <label htmlFor="hour" className="text-gray-700 dark:text-white">Selecciona una hora:</label>
        {isLoading ? (
          <div className='w-full p-4 flex justify-center items-center'>
            <span className='buttonLoader'></span>
          </div>
        ) : error ? (
          <p className="text-red-500">{error instanceof Error ? error.message : "No se han encontrado datos de reserva para esta fecha"}</p>
        ) : reservation ? (
          <div className="hours-grid grid grid-cols-4 gap-2 mt-4">
            {reservation.schedule.map((slot: Schedule, index: number) => (
              <button
                key={index}
                className={`hour-button p-3 text-center rounded-lg font-semibold transition-all ${slot.occupied
                  ? 'bg-red-500 text-white cursor-not-allowed'
                  : selectedHour === slot.hour
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 dark:text-white'
                  }`}
                onClick={() => handleHourClick(slot.hour, slot.occupied)}
                disabled={slot.occupied}
              >
                {slot.hour} {slot.occupied ? '(Reservado)' : '(Disponible)'}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-300">No hay horarios disponibles.</p>
        )}
      </div>

      <p className="text-lg font-bold mt-4 dark:text-white">Total a pagar: ${totalAmount}</p>

      <button
        disabled={!selectedDate || !selectedHour}
        onClick={handlePayment}
        className={`mt-6 w-full py-3 px-4 rounded-lg font-semibold text-white transition-all ${(!selectedDate || !selectedHour) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
      >
        Confirmar y Pagar
      </button>
    </div>
  );
}

export default ReservationForm;
