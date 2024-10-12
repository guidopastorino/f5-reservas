import { Metadata } from 'next'
import React from 'react'
import SettingsPage from './SettingsPage'

export const metadata: Metadata = {
  title: "Configuración de cuenta"
}

const page = () => {
  return (
    <SettingsPage />
  )
}

export default page