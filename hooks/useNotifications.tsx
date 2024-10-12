"use client"

import { useSession } from 'next-auth/react';
import { useQuery } from 'react-query';
import ky from 'ky';
import { NotificationProps } from '@/types/types';
import { useState } from 'react';

// Hook para manejar las notificaciones (fetchs reutilizables)
const useNotifications = () => {
  const { data: session } = useSession();

  const [totalNotifications, setTotalNotifications] = useState<number>(0)
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0)

  // Función para obtener las notificaciones del usuario
  const fetchUserNotifications = async (): Promise<NotificationProps[]> => {
    if (!session?.user?.id) throw new Error("Usuario no autenticado");
    const notifications = await ky.get(`/api/users/${session?.user?.id}/notifications`).json();
    return notifications as NotificationProps[];
  };

  // Hook de React Query para obtener las notificaciones
  const { data: notifications, error, isLoading } = useQuery<NotificationProps[], Error>(
    ["notifications", session?.user?.id],
    fetchUserNotifications,
    {
      enabled: !!session?.user?.id, 
      refetchOnWindowFocus: true,
      cacheTime: 0,
      onSuccess: (data) => {
        // Set the total length of the notifications
        setTotalNotifications(data.length)

        // Set the length of the unread notifications
        const unread = data.filter((notification) => !notification.seen).length;
        setUnreadNotifications(unread);
      },
    }
  );

  return { notifications, error, isLoading, unreadNotifications, totalNotifications, session };
};

export default useNotifications;