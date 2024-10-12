import { Metadata } from 'next'
import React from 'react'
import NotificationsPageComponent from './NotificationsPageComponent';

export const metadata: Metadata = {
  title: "Notificaciones"
};

const page = () => {
  return (
    <NotificationsPageComponent />
  )
}

export default page