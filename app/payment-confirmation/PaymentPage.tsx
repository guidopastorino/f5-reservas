"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import ky from 'ky';
import { useQueryClient } from 'react-query';

function PaymentPage() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const date = searchParams.get('date');
  const hour = searchParams.get('hour');
  const amount = searchParams.get('amount');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const queryClient = useQueryClient();

  const handleConfirmPayment = async () => {
    setIsLoading(true);
    setErrorMessage('');

    if (!session || !session.user || !session.user.id) {
      setErrorMessage("No se ha encontrado la sesión del usuario.");
      setIsLoading(false);
      return;
    }

    const validDate = date || "";
    const formattedDate = new Date(validDate).toISOString().split('T')[0];

    try {
      const response = await ky.put(`/api/reservations/${formattedDate}`, {
        json: {
          hour,
          userId: session.user.id
        },
      }).json();

      console.log(response)

      // Invalidar queries para actualizar datos en tiempo real
      queryClient.invalidateQueries(['userReservations', session?.user?.id]);
      queryClient.invalidateQueries(["notifications", session?.user?.id]);

    } catch (error: any) {
      if (error.response) {
        try {
          const errorData = await error.response.json();
          setErrorMessage(errorData.message || "Error desconocido.");
        } catch (jsonError) {
          setErrorMessage(error.response.statusText || "Error desconocido.");
        }
      } else {
        setErrorMessage(error.message || "Hubo un error al confirmar el pago.");
      }
      console.error("Error al confirmar el pago:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!date || !hour || !amount) {
    return <p>No se han recibido todos los datos necesarios.</p>;
  }

  return (
    <div className="w-full mx-auto max-w-screen-lg flex flex-col justify-start items-center gap-3">
      <span className='text-3xl font-medium text-center block my-3'>Confirmar Pago</span>
      <p className="dark:text-white">Fecha: {date}</p>
      <p className="dark:text-white">Hora: {hour}</p>
      <p className="dark:text-white">Total a pagar: ${amount}</p>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <button
        onClick={handleConfirmPayment}
        className={`w-full max-w-40 p-3 text-center font-medium text-white bg-neutral-700 rounded-sm ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? 'Procesando...' : 'Confirmar y Pagar'}
      </button>
    </div>
  );
}

export default PaymentPage;