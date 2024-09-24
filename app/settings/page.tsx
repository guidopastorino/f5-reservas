'use client'
import useUser from '@/hooks/useUser'
import React from 'react'

const Page = () => {
  const user = useUser();

  // Verifica que haya una fecha disponible y formatea la fecha
  const formatDate = (date: string) => {
    const formattedDate = date
      ? new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
      : 'Fecha no disponible';

    return formattedDate
  }

  // Extrae las iniciales del nombre completo del usuario
  const initials = (user.fullname || '')
    .split(' ')
    .map(name => name.charAt(0).toUpperCase())
    .join('');

  return (
    <div className="w-full border max-w-screen-lg mx-auto p-4">
      {/* Círculo de color dinámico */}
      <div
        className='w-40 h-40 overflow-hidden rounded-full flex justify-center items-center text-white font-bold text-6xl'
        style={{ backgroundColor: user.color || '#000' }} // Usa color dinámico o negro como fallback
      >
        <span>{initials}</span>
      </div>

      <div className="mt-4">
        Cuenta creada el {formatDate(user.createdAt || '')}
      </div>

      <div className="mt-4">
        Cuenta modificada por última vez el {formatDate(user.updatedAt || '')}
      </div>

      <div className="mt-2">
        <span className="font-bold">Fullname:</span> {user.fullname}
      </div>

      <div className="mt-2">
        <span className="font-bold">Email:</span> {user.email}
      </div>

      <div className="mt-2">
        <span className="font-bold">Username:</span> {user.username}
      </div>

      <div className="mt-2">
        <span className="font-bold">Role:</span> {user.role}
      </div>
    </div>
  );
}

export default Page;
