import { Metadata } from 'next';
import React from 'react'
import ReservationsComponent from './ReservationsComponent';

export const metadata: Metadata = {
  title: "Mis reservas"
};

const page = () => {
  return (
    <ReservationsComponent />
  )
}

export default page