"use client";

import useNotifications from '@/hooks/useNotifications';
import NotificationList from '@/components/notification/NotificationList';
import { isToday, isYesterday, differenceInDays } from 'date-fns';

const getGroupLabel = (date: Date) => {
  if (isToday(date)) return 'Hoy';
  if (isYesterday(date)) return 'Ayer';

  const daysAgo = differenceInDays(new Date(), date);

  if (daysAgo <= 7) return 'Hace una semana';
  if (daysAgo <= 30) return 'Este mes';
  if (daysAgo <= 365) return 'Este año';

  return 'Más de un año';
};

const NotificationsPageComponent = () => {
  const { notifications, isLoading, error, totalNotifications, unreadNotifications } = useNotifications();

  // Agrupar notificaciones por fecha solo en esta página
  const groupedNotifications = notifications?.reduce((groups: { [key: string]: any[] }, notification) => {
    const date = new Date(notification.createdAt);
    const group = getGroupLabel(date);
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(notification);
    return groups;
  }, {});

  return (
    <div className="w-full h-full p-3">
      {isLoading && <p>Cargando...</p>}
      {error && <p>Error: {error.message}</p>}
      {groupedNotifications && (
        <div className='py-5 w-full max-w-96 mx-auto'>
          <div className='flex flex-col gap-2 justify-start items-start mb-4'>
            <p>Tus notificaciones: {totalNotifications}</p>
            <p>No leídas: {unreadNotifications}</p>
          </div>

          {/* Renderizar notificaciones agrupadas por fecha */}
          {Object.keys(groupedNotifications).map((group) => (
            <div key={group} className="w-full">
              <h3 className="text-lg font-bold mb-2">{group}</h3>
              <NotificationList notifications={groupedNotifications[group]} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPageComponent;