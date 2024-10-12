"use client"

import React from 'react';
import { NotificationProps } from '@/types/types';
import NotificationCard from '@/components/notification/NotificationCard'; // Componente para cada notificación
import { useSession } from 'next-auth/react';
import { useQueryClient } from 'react-query';
import ky from 'ky';

// Componente para la lista de notificaciones
const NotificationList: React.FC<{ notifications: NotificationProps[] }> = ({ notifications }) => {
  return (
    <div className="flex flex-col justify-start items-start gap-0.5 w-full overflow-auto">
      {notifications?.length === 0 ? (
        <div className="p-4">No tienes notificaciones</div>
      ) : (
        notifications.map((notification) => (
          <NotificationCard
            key={notification._id}
            notification={notification}
          />
        ))
      )}
    </div>
  );
};

export default NotificationList;