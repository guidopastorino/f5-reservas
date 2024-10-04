import ReservationForm from '@/components/ReservationForm'
import React from 'react'

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