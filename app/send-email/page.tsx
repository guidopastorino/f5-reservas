import { Metadata } from 'next';
import React from 'react'
import SendEmailPageComponent from './SendEmailPageComponent';

export const metadata: Metadata = {
  title: "Enviar email"
};

const page = () => {
  return (
    <SendEmailPageComponent />
  )
}

export default page