'use client'
import { useShowMessage } from '@/hooks/useShowMessage';
import useUser from '@/hooks/useUser'
import axios from 'axios';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

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


  // Función para eliminar el usuario
  const { data: session } = useSession()

  const { message, visible, showMessage } = useShowMessage()

  const [loading, setLoading] = useState<boolean>(false)

  const deleteUser = async () => {
    try {
      setLoading(true)
      const res = await axios.delete(`/api/users/${session?.user.id || ''}`);

      if (res.status === 200) {
        showMessage(res.data.message);
        setTimeout(() => {
          signOut({ callbackUrl: '/' });
        }, 1000);
      } else {
        showMessage(`Error eliminando usuario: ${res.data.error}`);
      }
    } catch (error) {
      showMessage(`Error eliminando usuario: ${error}`);
    }
    setLoading(false)
  };

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

      <button
        onClick={deleteUser}
        disabled={loading}
        className="w-full max-w-max mx-auto font-medium my-5 rounded-full bg-red-900 text-white py-3 px-5 text-sm hover:bg-red-700 duration-100 flex justify-center items-center"
      >
        {loading ? <span className="buttonLoader"></span> : "Eliminar cuenta"}
      </button>

      <Link href={"/settings/password"} className="text-start text-sm no-underline hover:underline w-full block">Olvidaste tu contraseña?</Link>

      {visible && <span>{message}</span>}
    </div>
  );
}

export default Page;
