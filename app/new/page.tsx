import ReservationForm from '@/components/ReservationForm'
import { Metadata } from 'next';
import React from 'react'

export const metadata: Metadata = {
  title: "Nueva reserva"
};

const page = () => {
  return (
    <div>
      {/* añadir control de errores como pasarse de horas o horas negativas */}
      {/* añadir reservar en hora establecida */}
      <ReservationForm />
    </div>
  )
}

export default page