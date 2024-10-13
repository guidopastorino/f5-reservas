"use client";

import React, { useEffect, useState } from 'react';
import DropdownMenu from '@/components/DropdownMenu';
import { useSession } from 'next-auth/react';
import { BiBell } from 'react-icons/bi';
import { NotificationProps } from '@/types/types';
import { useQueryClient, useMutation } from 'react-query';
import { useInView } from "react-intersection-observer";
import { MdOutlineEmail, MdOutlinePersonOutline } from "react-icons/md";
import { BsCalendarCheck } from "react-icons/bs";
import { PiDotsThreeBold } from "react-icons/pi";
import { formatDistanceToNowStrict } from 'date-fns';
import ky from "ky";
import { es } from 'date-fns/locale';

const NotificationCard: React.FC<{ notification: NotificationProps }> = ({ notification }) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const queryClient = useQueryClient();
  const { data: session } = useSession();

  // Estado local optimista para manejar el cambio del estado "seen"
  const [isSeen, setIsSeen] = useState(notification.seen);
  const [isHidden, setIsHidden] = useState(false); // Estado local para ocultar la notificación

  // Función para marcar la notificación como leída en el servidor
  const markAsRead = async (notificationId: string) => {
    try {
      await ky.put(`/api/users/${session?.user?.id}/notifications/${notificationId}`, {
        json: { seen: true },
      });
      queryClient.invalidateQueries(["notifications", session?.user?.id]);
    } catch (error) {
      console.error("Error al marcar como leída:", error);
    }
  };

  // Mutación optimista para ocultar notificación
  const { mutate: hideNotification } = useMutation(
    async ({ userId }: { userId: string }) => {
      await ky.delete(`/api/users/${userId}/notifications/${notification._id}`);
    },
    {
      onMutate: async (variables) => {
        // Optimistic update: cancelar las queries actuales para evitar conflictos
        await queryClient.cancelQueries(['notifications', variables.userId]);

        const previousNotifications = queryClient.getQueryData(['notifications', variables.userId]);

        // Actualiza el estado local optimistamente para ocultar la notificación
        setIsHidden(true);

        queryClient.setQueryData(['notifications', variables.userId], (old: any) =>
          old?.filter((notif: NotificationProps) => notif._id !== notification._id)
        );

        return { previousNotifications };
      },
      onError: (error, variables, context: any) => {
        // Si hay un error, revertimos el cambio
        setIsHidden(false);
        queryClient.setQueryData(['notifications', variables.userId], context.previousNotifications);
      },
      onSettled: (data, error, variables) => {
        // Invalidamos las queries de notificaciones para obtener la data actualizada
        queryClient.invalidateQueries(['notifications', variables.userId]);
      },
    }
  );

  useEffect(() => {
    if (inView && !isSeen) {
      // Cambia el estado local optimistamente
      setIsSeen(true);
      markAsRead(notification._id);
    }
  }, [inView, isSeen, notification._id]);

  if (isHidden) {
    return null; // Si la notificación está oculta, no se renderiza
  }

  return (
    <div
      ref={ref}
      data-id={notification._id}
      data-seen={isSeen}
      className={`notification-card bg-white dark:bg-neutral-800 w-full max-w-96 mx-auto`}
    >
      <NotificationContent notification={notification} isSeen={isSeen} hideNotification={hideNotification} />
    </div>
  );
};

export default NotificationCard;

const NotificationContent: React.FC<{ notification: NotificationProps; isSeen: boolean; hideNotification: any }> = ({ notification, isSeen, hideNotification }) => {
  const { data: session } = useSession();

  // Función para formatear el tiempo transcurrido en formato abreviado en español
  const getTimeAgo = (dateString: string) => {
    return formatDistanceToNowStrict(new Date(dateString), { addSuffix: false, locale: es });
  };

  const handleHideNotification = () => {
    if (!session?.user.id) return;
    const userId = session?.user.id;
    hideNotification({ userId, notificationId: notification._id });
  };

  return (
    <div className={`relative block transition-all duration-1000 ${isSeen ? '' : 'bg-blue-200 dark:bg-blue-950'} w-full`}>
      <div className='w-full flex justify-center items-start gap-3 p-3 border-b dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700'>
        {/* Icon */}
        <div className='w-7 h-7 flex justify-center items-center shrink-0'>
          {notification.type === 'email' ? (
            <MdOutlineEmail className='w-full h-full object-contain' />
          ) : notification.type === 'reservation' ? (
            <BsCalendarCheck className='w-full h-full object-contain' />
          ) : notification.type === 'account' ? (
            <MdOutlinePersonOutline className='w-full h-full object-contain' />
          ) : (
            <BiBell className='w-full h-full object-contain' />
          )}
        </div>
        {/* Content */}
        <div className="flex flex-col justify-start items-start w-[80%]">
          <span className='text-md'>{getTimeAgo(notification.createdAt)}</span>
          <span className='font-bold text-lg'>{notification.title}</span>
          <span className='w-full break-words'>{notification.message}</span>
        </div>
      </div>
      {/* DropdownMenu options */}
      <div className="absolute top-2 right-2">
        <DropdownMenu trigger={<PiDotsThreeBold className='cursor-pointer' size={23} />}>
          <ul className='py-1'>
            <li className='p-2 itemStyle' onClick={handleHideNotification}>Ocultar notificación</li>
            <li className='p-2 itemStyle'>Reportar abuso</li>
          </ul>
        </DropdownMenu>
      </div>
    </div>
  );
};