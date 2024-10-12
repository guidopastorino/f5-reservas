import React from 'react'
import { Metadata } from 'next'
import ResetPasswordPage from './ResetPasswordPage'

export const metadata: Metadata = {
  title: "Recuperar contraseña"
}

const page = () => {
  return (
    <ResetPasswordPage />
  )
}

export default page