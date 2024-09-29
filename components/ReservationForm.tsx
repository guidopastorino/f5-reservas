"use client";

import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import useUser from '@/hooks/useUser';
import { ReservationProps } from '@/types/types';
import 'react-datepicker/dist/react-datepicker.css';

function ReservationForm() {
  const [reservation, setReservation] = useState<ReservationProps | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [totalHours, setTotalHours] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const pricePerHour = 20000; // Precio por hora

  // Obtener el usuario
  const user = useUser();

  // Calcular la diferencia de horas y el monto total
  useEffect(() => {
    if (startTime && endTime) {
      const start = new Date(`1970-01-01T${startTime}:00`);
      const end = new Date(`1970-01-01T${endTime}:00`);
      const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Diferencia en horas

      if (diff > 0 && diff <= 3) {
        setTotalHours(diff);
        setTotalAmount(diff * pricePerHour);
      } else {
        setTotalHours(0);
        setTotalAmount(0);
      }
    }
  }, [startTime, endTime]);

  // Actualizar el estado de la reserva con los datos actuales
  useEffect(() => {
    if (user && selectedDate && startTime && endTime) {
      setReservation({
        userId: user._id || '',
        selectedDate,
        startTime,
        endTime,
        totalHours,
        totalAmount,
      });
    }
  }, [user, selectedDate, startTime, endTime, totalHours, totalAmount]);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reservation) {
      console.log("Datos de la reserva:", reservation);
      // Aquí podrías manejar la lógica de reserva, como enviar los datos al servidor
    }
  };

  return (
    <form onSubmit={handleSubmit} className="reservation-form">
      <div className="form-group">
        <label htmlFor="date">Selecciona una fecha:</label>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          minDate={new Date()} // Evitar fechas pasadas
          maxDate={new Date(new Date().setMonth(new Date().getMonth() + 1))} // Periodo máximo de un mes
          inline // Esto hace que el calendario esté siempre visible
          className="formInput"
          placeholderText="Elige una fecha"
        />
      </div>

      <div className="form-group">
        <label htmlFor="startTime">Hora de inicio:</label>
        <input
          type="time"
          id="startTime"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          step="3600" // Limita los intervalos a 1 hora (3600 segundos)
          className="formInput"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="endTime">Hora de fin:</label>
        <input
          type="time"
          id="endTime"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          step="3600" // Limita los intervalos a 1 hora (3600 segundos)
          className="formInput"
          required
        />
      </div>

      <div className="form-group">
        <p>Total horas: {totalHours}</p>
        <p>Total a pagar: ${totalAmount}</p>
      </div>

      <button type="submit" className="submit-button">Reservar</button>
    </form>
  );
}

export default ReservationForm;
