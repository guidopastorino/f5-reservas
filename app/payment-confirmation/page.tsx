import React from 'react'
import PaymentPage from './PaymentPage'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Confirmar pago"
};

const page = () => {
  return (
    <PaymentPage />
  )
}

export default page