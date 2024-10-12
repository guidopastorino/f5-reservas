import { NextResponse } from 'next/server';
import User from '@/models/User';
import Notification from '@/models/Notification';
import dbConnect from '@/lib/dbConnect';

// /api/users/[id]/notifications/[notificationId]
// 'id': id del usuario
// 'reservationId': id de la reserva

// Actualizar una notificación específica de un usuario (se usará generalmente para establecer si fue vista o no (seen))
export async function PUT(req: Request, { params }: { params: { id: string, notificationId: string } }) {
  try {
    await dbConnect();

    const { notificationId } = params;

    // Buscar la notificación por su ID
    const notification = await Notification.findById(notificationId);
    if (!notification) {
      return NextResponse.json({ message: 'Notificación no encontrada' }, { status: 404 });
    }

    // Actualizar el estado de 'seen' a true
    notification.seen = true;
    await notification.save();

    return NextResponse.json({ message: 'Notificación actualizada correctamente', notification }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error al actualizar la notificación', error }, { status: 500 });
  }
}

// Eliminar una notificación específica del usuario
export async function DELETE(req: Request, { params }: { params: { id: string, notificationId: string } }) {
  try {
    await dbConnect();

    const { id, notificationId } = params;

    // Buscar al usuario por su ID
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    // Verificar si la notificación existe en el array del usuario
    const notificationIndex = user.notifications.indexOf(notificationId);
    if (notificationIndex === -1) {
      return NextResponse.json({ message: 'Notificación no encontrada en este usuario' }, { status: 404 });
    }

    // Eliminar la notificación del array del usuario
    user.notifications.splice(notificationIndex, 1);
    await user.save();

    // Eliminar la notificación de la base de datos
    await Notification.findByIdAndDelete(notificationId);

    return NextResponse.json({ message: 'Notificación eliminada correctamente' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error al eliminar la notificación', error }, { status: 500 });
  }
}