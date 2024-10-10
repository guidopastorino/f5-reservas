import { NextResponse } from 'next/server';
import User from '@/models/User';
import Notification from '@/models/Notification';
import dbConnect from '@/lib/dbConnect';

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
