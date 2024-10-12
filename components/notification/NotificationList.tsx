"use client"

import React from 'react';
import { NotificationProps } from '@/types/types';
import NotificationCard from '@/components/notification/NotificationCard'; // Componente para cada notificación
import { BiBellOff } from "react-icons/bi";


// Componente para la lista de notificaciones
const NotificationList: React.FC<{ notifications: NotificationProps[] }> = ({ notifications }) => {
  return (
    <div className="flex flex-col justify-start items-start w-full h-full overflow-auto">
      {notifications?.length === 0 ? (
        <div className="p-4 flex justify-center items-center w-full h-full flex-col gap-5">
          <BiBellOff size={50} className='text-black dark:text-neutral-500' />
          <span className='text-black dark:text-neutral-500 opacity-80'>No hay notificaciones para mostrar</span>
        </div>
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