'use client'
import ProfilePicture from '@/components/ProfilePicture';
import { useShowMessage } from '@/hooks/useShowMessage';
import useUser from '@/hooks/useUser'
import ky from 'ky';
import { signOut, useSession } from 'next-auth/react';
import React, { useState } from 'react'

type DeleteUserResponse = {
  ok: boolean;
  data?: {
    message?: string;
    error?: string;
  };
};

const SettingsPage = () => {
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

  // Función para eliminar el usuario
  const { data: session } = useSession()

  const { message, visible, showMessage } = useShowMessage()

  const [loading, setLoading] = useState<boolean>(false)

  const deleteUser = async () => {
    try {
      setLoading(true);

      const res = await ky.delete(`/api/users/${session?.user.id || ''}`).json<DeleteUserResponse>();

      if (res.ok) {
        showMessage(res.data?.message || 'Usuario eliminado exitosamente');
        setTimeout(() => {
          signOut({ callbackUrl: '/' });
        }, 1000);
      } else {
        showMessage(`Error eliminando usuario: ${res.data?.error || 'Error desconocido'}`);
      }
    } catch (error) {
      showMessage(`Error eliminando usuario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="w-full border max-w-screen-lg mx-auto p-4">
      <ProfilePicture className="w-full max-w-40 aspect-square" />

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

      <button
        onClick={() => signOut()}
        className="w-full max-w-max mx-auto font-medium my-5 rounded-full bg-neutral-900 text-white py-3 px-5 text-sm hover:bg-neutral-700 duration-100 flex justify-center items-center"
      >
        Cerrar sesión
      </button>

      {visible && <span>{message}</span>}
    </div>
  );
}

export default SettingsPage;
