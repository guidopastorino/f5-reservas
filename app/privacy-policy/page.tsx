import React from 'react';

const page = () => {
  const lastUpdated: number = 1726421118251; // timestamp con la información de la última vez modificado
  const lastUpdatedDate = new Date(lastUpdated).toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <main>
      <header className='mb-6'>
        <h1 className='text-4xl font-bold'>Política de Privacidad</h1>
        <p className='mt-2 text-lg'><strong>Última actualización: </strong>{lastUpdatedDate}</p>
      </header>

      <section className='mb-5'>
        <p>En <strong>Reservas F5</strong> ("nosotros"), nos tomamos muy en serio la privacidad de nuestros usuarios. Esta Política de Privacidad describe cómo recopilamos, usamos y protegemos la información personal de los usuarios de nuestra aplicación de reservas de fútbol 5. Al utilizar nuestra Aplicación, aceptas las prácticas descritas en esta Política de Privacidad.</p>
      </section>

      <section className='mb-5'>
        <h2 className='text-2xl font-semibold mb-2'>1. Información que Recopilamos</h2>
        
        <h3 className='text-xl font-semibold pl-3 my-3'>a. Información que proporcionas</h3>
        <p>Cuando te registras en nuestra Aplicación, recopilamos la siguiente información personal que nos proporcionas:</p>
        <ul className='list-disc list-inside ml-5'>
          <li>Nombre completo</li>
          <li>Dirección de correo electrónico</li>
          <li>Número de teléfono</li>
          <li>Contraseña (encriptada)</li>
          <li>Información relacionada con las reservas (como fecha, hora, etc.)</li>
        </ul>

        <h3 className='text-xl font-semibold pl-3 my-3'>b. Información automática</h3>
        <p>Podemos recopilar automáticamente cierta información técnica cuando utilizas nuestra Aplicación:</p>
        <ul className='list-disc list-inside ml-5'>
          <li>Dirección IP</li>
          <li>Tipo de dispositivo y sistema operativo</li>
          <li>Datos de uso (interacciones con la aplicación, tiempo de uso, etc.)</li>
        </ul>
      </section>

      <section className='mb-5'>
        <h2 className='text-2xl font-semibold mb-2'>2. Uso de la Información</h2>
        <p>Usamos la información recopilada para:</p>
        <ul className='list-disc list-inside ml-5'>
          <li>Gestionar las cuentas de usuario y proporcionar acceso a la Aplicación.</li>
          <li>Procesar reservas de la cancha de fútbol 5.</li>
          <li>Facilitar la publicación de fotos y comentarios en la sección "Momentos".</li>
          <li>Mejorar la experiencia del usuario y el funcionamiento de la Aplicación.</li>
          <li>Enviar notificaciones sobre las reservas, actualizaciones de la Aplicación o eventos relacionados con el fútbol 5.</li>
          <li>Cumplir con requisitos legales y de seguridad.</li>
        </ul>
      </section>

      <section className='mb-5'>
        <h2 className='text-2xl font-semibold mb-2'>3. Compartir Información</h2>
        <p>No vendemos ni alquilamos tu información personal a terceros. Solo compartimos información con terceros en los siguientes casos:</p>
        <ul className='list-disc list-inside ml-5'>
          <li>Proveedores de servicios que nos ayudan a operar la Aplicación, como servicios de alojamiento, procesamiento de pagos o plataformas de mensajería.</li>
          <li>Para cumplir con obligaciones legales o proteger los derechos, la propiedad o la seguridad de nuestra empresa, usuarios u otros.</li>
        </ul>
      </section>

      <section className='mb-5'>
        <h2 className='text-2xl font-semibold mb-2'>4. Seguridad de la Información</h2>
        <p>Nos comprometemos a proteger tu información personal. Implementamos medidas técnicas y organizativas para proteger tus datos contra el acceso no autorizado, la pérdida o el uso indebido. Sin embargo, ninguna transmisión de datos por Internet o sistema de almacenamiento es completamente seguro, por lo que no podemos garantizar la seguridad absoluta de tu información.</p>
      </section>

      <section className='mb-5'>
        <h2 className='text-2xl font-semibold mb-2'>5. Tus Derechos</h2>
        <p>Tienes el derecho de acceder, rectificar o eliminar tu información personal en cualquier momento. Si deseas ejercer alguno de estos derechos, por favor contáctanos a través de <a href="mailto:reservasf5fighiera@gmail.com" className='text-blue-500 underline'>reservasf5fighiera@gmail.com</a>. Haremos lo posible para responder a tu solicitud de manera oportuna.</p>
      </section>

      <section className='mb-5'>
        <h2 className='text-2xl font-semibold mb-2'>6. Retención de Datos</h2>
        <p>Retendremos tu información personal solo durante el tiempo necesario para cumplir con los fines descritos en esta Política de Privacidad, o según lo requiera la ley.</p>
      </section>

      <section className='mb-5'>
        <h2 className='text-2xl font-semibold mb-2'>7. Cookies</h2>
        <p>Podemos usar cookies y tecnologías similares para mejorar la funcionalidad de la Aplicación y personalizar la experiencia del usuario. Puedes configurar tu navegador para rechazar las cookies, pero esto puede afectar ciertas funcionalidades de la Aplicación.</p>
      </section>

      <section className='mb-5'>
        <h2 className='text-2xl font-semibold mb-2'>8. Cambios en la Política de Privacidad</h2>
        <p>Nos reservamos el derecho de modificar esta Política de Privacidad en cualquier momento. Cualquier cambio se publicará en esta página, y te notificaremos sobre los cambios importantes a través de la Aplicación o por correo electrónico.</p>
      </section>

      <section className='mb-5'>
        <h2 className='text-2xl font-semibold mb-2'>9. Contacto</h2>
        <p>Si tienes alguna pregunta o inquietud sobre esta Política de Privacidad, puedes contactarnos en:</p>
        <ul className='list-disc list-inside ml-5'>
          <li><a href="mailto:reservasf5fighiera@gmail.com" className='text-blue-500 underline'>reservasf5fighiera@gmail.com</a></li>
          <li>Teléfono de soporte: 3402 55-2736</li>
          <li>Dirección física: Marconi 873, Fighiera, Santa Fe</li>
        </ul>
      </section>
    </main>
  );
};

export default page;