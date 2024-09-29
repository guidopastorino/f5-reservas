import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function ReservationForm() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [totalHours, setTotalHours] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const pricePerHour = 20000; // Precio por hora

  // Función para calcular la diferencia de horas y el monto total
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

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí podrías manejar la lógica de reserva
    console.log({
      selectedDate,
      startTime,
      endTime,
      totalHours,
      totalAmount
    });
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
