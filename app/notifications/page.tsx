"use client"

import useNotifications from '@/hooks/useNotifications';
import NotificationList from '@/components/notification/NotificationList';

const NotificationsPage = () => {
  const { notifications, isLoading, error, totalNotifications, unreadNotifications } = useNotifications();

  return (
    <div className="container">
      <h1>Tus notificaciones: ({totalNotifications}). No leídas: {unreadNotifications}</h1>
      {isLoading && <p>Cargando...</p>}
      {error && <p>Error: {error.message}</p>}
      {notifications && (
        <NotificationList notifications={notifications} />
      )}
    </div>
  );
};

export default NotificationsPage;
