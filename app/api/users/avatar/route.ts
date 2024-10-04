import { NextRequest, NextResponse } from 'next/server';
import { createCanvas } from 'canvas';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fullname = searchParams.get('fullname');
  const color = searchParams.get('color') || '#009688'; // Color por defecto si no se proporciona

  if (!fullname) {
    return NextResponse.json({ error: 'Fullname is required' }, { status: 400 });
  }

  // Extraer las iniciales del nombre completo
  const initials = fullname.split(' ').map(word => word[0]).join('').toUpperCase();

  // Crear un lienzo (canvas) de 100x100 píxeles
  const canvas = createCanvas(100, 100);
  const ctx = canvas.getContext('2d');

  // Establecer el color de fondo (aquí se usa el color proporcionado o uno por defecto)
  ctx.fillStyle = color; // Color sólido de fondo proporcionado en el query param
  ctx.fillRect(0, 0, 100, 100); // Dibuja el fondo

  // Configurar el estilo del texto
  ctx.font = '50px sans-serif'; // Tamaño y estilo de la fuente
  ctx.fillStyle = '#ffffff'; // Color del texto (blanco para contraste)
  ctx.textAlign = 'center'; // Centrar el texto horizontalmente
  ctx.textBaseline = 'middle'; // Centrar el texto verticalmente

  // Dibujar las iniciales en el centro del lienzo
  ctx.fillText(initials, 50, 50);

  // Devolver la imagen como PNG
  const buffer = canvas.toBuffer();
  return new NextResponse(buffer, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
    },
  });
}