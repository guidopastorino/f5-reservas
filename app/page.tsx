import React from 'react'

const page = async () => {
  return (
    <main className="w-full max-w-screen-lg mx-auto p-4">
      <section className='w-full max-h-[600px] h-[70dvh] relative'>
        <div className='bg-gradient-to-t from-neutral-950 w-full h-full absolute top-0 left-0 right-0 bottom-0 z-20'></div>
        <img className='w-full h-full object-cover' src="/cancha.webp" alt="Foto de cancha de Fútbol 5" />
      </section>
    </main>
  );
};

export default page;