"use client";

import React, { useState } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";

interface CalendarProps {
  minDate?: Date; // Fecha mínima seleccionable
  maxDate?: Date; // Fecha máxima seleccionable
  disabledDates?: Date[]; // Fechas que deben estar deshabilitadas
  selected?: Date | null; // Fecha seleccionada
  onDateChange: (date: Date) => void; // Función de callback para cambiar la fecha
  selectedClass?: string; // Clase para el día seleccionado
  dayClass?: string; // Clase para los días
  dateFormat?: string; // Formato de fecha
}

const Calendar: React.FC<CalendarProps> = ({
  minDate,
  maxDate,
  disabledDates = [],
  selected,
  onDateChange,
  selectedClass = 'bg-blue-500 text-white', // Clase por defecto para el día seleccionado
  dayClass = 'text-black hover:bg-gray-200', // Clase por defecto para los días
  dateFormat // Nuevo prop para el formato de la fecha
}) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay(); // Devuelve el día de la semana (0=Domingo, 6=Sábado)
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const totalCells = daysInMonth + firstDay;

  const handleDateClick = (day: number) => {
    const selectedDate = new Date(currentYear, currentMonth, day);
    if (isDateDisabled(selectedDate)) {
      return;
    }
    onDateChange(selectedDate); // Llama a la función de cambio de fecha
  };

  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    if (date.getDay() == 0) return true; // Si es domingo
    if (disabledDates.some(d => d.getTime() === date.getTime())) return true;
    return false;
  };

  const renderDays = () => {
    const days: JSX.Element[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10"></div>); // Celdas vacías
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const disabled = isDateDisabled(date);
      const isSelected = selected && selected.getDate() === day && selected.getMonth() === currentMonth && selected.getFullYear() === currentYear;

      days.push(
        <div
          key={day}
          className={`w-10 h-10 flex items-center justify-center cursor-pointer ${disabled ? 'dark:text-neutral-600 text-gray-400 cursor-default line-through' : (isSelected ? selectedClass : dayClass)}`}
          onClick={() => !disabled && handleDateClick(day)}
        >
          {day}
        </div>
      );
    }
    return days;
  };

  const changeMonth = (direction: number) => {
    const newMonth = currentMonth + direction;
    if (newMonth < 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else if (newMonth > 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(newMonth);
    }
  };

  const formatDate = (date: Date, format: string) => {
    // Lógica para formatear la fecha según el formato proporcionado
    const options: Intl.DateTimeFormatOptions = {};

    if (format.includes('dd')) options.day = '2-digit';
    if (format.includes('MM')) options.month = '2-digit';
    if (format.includes('yyyy')) options.year = 'numeric';

    return new Intl.DateTimeFormat('es-ES', options).format(date);
  };

  // Calendario
  return (
    <div className="bg-white dark:bg-neutral-800 shadow-md rounded-lg p-4 mx-auto max-w-[400px] w-full">
      <div className="flex justify-between items-center mb-2">
        <button className='w-10 h-10 rounded-full flex justify-center items-center text-xl dark:hover:bg-neutral-700 hover:bg-gray-300' onClick={() => changeMonth(-1)}>
          <MdKeyboardArrowLeft />
        </button>
        <span>{`${new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date(currentYear, currentMonth)).charAt(0).toUpperCase() + new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date(currentYear, currentMonth)).slice(1)} ${currentYear}`}</span>
        <button className='w-10 h-10 rounded-full flex justify-center items-center text-xl dark:hover:bg-neutral-700 hover:bg-gray-300' onClick={() => changeMonth(1)}>
          <MdKeyboardArrowRight />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 7 }, (_, i) => (
          <div key={i} className="text-center font-bold">{['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][i]}</div>
        ))}
        {renderDays()}
      </div>
    </div>
  );
};

export default Calendar;