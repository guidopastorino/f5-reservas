'use client'
import ProfilePicture from '@/components/ProfilePicture';
import { useShowMessage } from '@/hooks/useShowMessage';
import useUser from '@/hooks/useUser';
import ky from 'ky';
import { signOut, useSession } from 'next-auth/react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const user = useUser();
  const { data: session } = useSession();
  const [loading, setLoading] = useState<boolean>(false);

  // Verifica que haya una fecha disponible y formatea la fecha
  const formatDate = (date: string) => {
    return date
      ? new Date(date).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'Fecha no disponible';
  };

  // Función para eliminar el usuario
  const deleteUser = async () => {
    // Mostrar una promesa de notificación mientras se elimina el usuario
    toast.promise(
      ky.delete(`/api/users/${session?.user.id || ''}`).json<any>(), // Promesa para eliminar usuario
      {
        loading: 'Eliminando usuario...',
        success: 'Usuario eliminado exitosamente',
        error: 'Error eliminando el usuario',
      }
    ).then(() => {
      setTimeout(() => {
        signOut(); // Cierra sesión después de eliminar el usuario
      }, 2000);
    }).catch(error => {
      console.error("Error eliminando el usuario:", error);
    });
  };

  // Función para cerrar sesión con notificación
  const handleSignOut = () => {
    toast.promise(
      signOut({ callbackUrl: '/' }), // Promesa para cerrar sesión
      {
        loading: 'Cerrando sesión...',
        success: 'Sesión cerrada exitosamente',
        error: 'Error cerrando sesión',
      }
    );
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
        onClick={handleSignOut}
        className="w-full max-w-max mx-auto font-medium my-5 rounded-full bg-neutral-900 text-white py-3 px-5 text-sm hover:bg-neutral-700 duration-100 flex justify-center items-center"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default SettingsPage;