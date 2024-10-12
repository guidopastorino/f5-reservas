import React from 'react'
import AuthPageComponent from './AuthPageComponent'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Iniciar sesión o registrarse"
}

const page = () => {
  return (
    <AuthPageComponent />
  )
}

export default page