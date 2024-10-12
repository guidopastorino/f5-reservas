import React from 'react'
import { Metadata } from 'next'
import ForgotPasswordPage from './ForgotPasswordPage'

export const metadata: Metadata = {
  title: "Solicitar recuperación de contraseña"
}

const page = () => {
  return (
    <ForgotPasswordPage />
  )
}

export default page