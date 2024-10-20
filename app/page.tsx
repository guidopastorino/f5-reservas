"use client"

import ReviewSlider from '@/components/reviews/ReviewSlider';
import SmoothDialog from '@/components/SmoothDialog';
import Link from 'next/link';
import React from 'react'

const page = async () => {

  const horarios = [
    "Lunes - de 13:00hs a 19:00hs",
    "Martes - de 09:00hs a 17:00hs",
    "Miércoles - de 10:00hs a 18:00hs",
    "Jueves - de 12:00hs a 20:00hs",
    "Viernes - de 09:00hs a 21:00hs",
    "Sábado - de 10:00hs a 14:00hs",
  ];

  return (
    <main className="w-full max-w-screen-lg mx-auto px-4">
      <section className='w-full max-h-[600px] h-[70dvh] relative overflow-hidden rounded-b-3xl shadow-lg'>
        <div className='bg-gradient-to-t from-neutral-950/70 w-full h-full absolute top-0 left-0 right-0 bottom-0 z-20'></div>
        <img className='w-full h-full object-cover shadow-lg' src="/cancha.webp" alt="Foto de cancha de Fútbol 5" />
      </section>

      <ReviewSlider />

      <SmoothDialog
        trigger={<div>Horarios de apertura</div>}
        dialogContent={
          <div>
            <ul>
              {horarios.map((el, i) => (
                <li key={i}>{el}</li>
              ))}
            </ul>
          </div>
        }
      />
      <Link href={"/new"} className='flex flex-col justify-start items-start gap-3 rounded-md p-3 w-full border-gray-300 dark:border-neutral-800 dark:hover:bg-neutral-800 hover:bg-neutral-200 duration-100 my-3 shadow-md border'>
        <p className='text-xl font-medium'>¡Haz una reserva!</p>
        <span className='dark:text-slate-400'>Reservar 1 hora de Fútbol 5 ($20000) entre los siguientes 7 días!</span>
      </Link>
    </main>
  );
};

export default page;