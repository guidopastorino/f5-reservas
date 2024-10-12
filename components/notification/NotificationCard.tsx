"use client"

import React, { useEffect } from 'react'
import DropdownMenu from '@/components/DropdownMenu'
import { useSession } from 'next-auth/react'
import { BiBell } from 'react-icons/bi'
import { NotificationProps } from '@/types/types'
import { useQueryClient, useMutation } from 'react-query'
import { useInView } from "react-intersection-observer";
import { MdOutlineEmail } from "react-icons/md";
import { MdOutlinePersonOutline } from "react-icons/md";
import { BsCalendarCheck } from "react-icons/bs";
import { PiDotsThreeBold } from "react-icons/pi";
import { formatDistanceToNowStrict } from 'date-fns';
import ky from "ky";
import { es } from 'date-fns/locale'

const NotificationCard: React.FC<{ notification: NotificationProps; }> = ({ notification }) => {
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: true,
  });

  const queryClient = useQueryClient();

  const { data: session } = useSession()

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

  // Hook para eliminar la notificación optimistamente
  const { mutate: hideNotification } = useMutation(
    async ({ userId }: { userId: string; }) => {
      await ky.delete(`/api/users/${userId}/notifications/${notification._id}`);
    },
    {
      // Optimistic update: Ocultar la notificación en la interfaz
      onMutate: async (variables) => {
        await queryClient.cancelQueries(['notifications', variables.userId]);

        const previousNotifications = queryClient.getQueryData(['notifications', variables.userId]);

        queryClient.setQueryData(['notifications', variables.userId], (old: any) =>
          old?.map((notif: NotificationProps) => notif._id === notification._id ? { ...notif, hidden: true } : notif)
        );

        return { previousNotifications };
      },
      // Revertir en caso de error
      onError: (error, variables, context: any) => {
        queryClient.setQueryData(['notifications', variables.userId], context.previousNotifications);
      },
      // Invalidar la caché para que se actualice en tiempo real
      onSettled: (data, error, variables) => {
        queryClient.invalidateQueries(['notifications', variables.userId]);
      },
    }
  );

  useEffect(() => {
    if (inView && !notification.seen) {
      markAsRead(notification._id);
    }
  }, [inView, notification.seen, notification._id, markAsRead]);

  return (
    <div
      ref={ref}
      data-id={notification._id}
      data-seen={notification.seen}
      className={`notification-card w-full px-4 py-2 ${notification.seen ? "bg-gray-200" : "bg-white"}`}
    >
      <NotificationContent notification={notification} hideNotification={hideNotification} />
    </div>
  );
};

export default NotificationCard;

const NotificationContent: React.FC<{ notification: NotificationProps; hideNotification: any }> = ({ notification, hideNotification }) => {
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
    <div className={`relative block transition-all duration-1000 ${notification.seen ? '' : 'bg-blue-200 dark:bg-blue-100'} dark:bg-neutral-800 w-full`}>
      <div className='w-full flex justify-center items-start gap-3 p-3 border-b border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700'>
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
          <span className='w-full break-all'>{notification.message}</span>
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
    </div>
  );
};