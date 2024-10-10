import { NextResponse } from 'next/server';
import User from '@/models/User';
import dbConnect from '@/lib/dbConnect';
import Notification from '@/models/Notification';

// Obtener todas las notificaciones del array 'notifications' del usuario
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const user = await User.findById(params.id).populate('notifications');

    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    const notifications = await Notification.find({ _id: { $in: user.notifications } });

    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error al obtener las notificaciones', error }, { status: 500 });
  }
}

// Crear una nueva notificación y añadirla al array 'notifications' del usuario
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const user = await User.findById(params.id);

    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    const { type, title, message } = await req.json();

    const newNotification = await Notification.create({
      to: user._id,
      type,
      title,
      message,
    });

    // Añadir la notificación al array de notificaciones del usuario
    user.notifications.push(newNotification._id);
    await user.save();

    return NextResponse.json(newNotification, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error al crear la notificación', error }, { status: 500 });
  }
}

// Eliminar todas las notificaciones del usuario
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const user = await User.findById(params.id);

    if (!user) {
      return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
    }

    // Eliminar todas las notificaciones asociadas al usuario
    await Notification.deleteMany({ _id: { $in: user.notifications } });

    // Limpiar el array de notificaciones del usuario
    user.notifications = [];
    await user.save();

    return NextResponse.json({ message: 'Todas las notificaciones han sido eliminadas' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error al eliminar las notificaciones', error }, { status: 500 });
  }
}