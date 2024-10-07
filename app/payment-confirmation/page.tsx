"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; // Importar useSession
import ky from 'ky';

function PaymentPage() {
  const searchParams = useSearchParams();
  const { data: session } = useSession(); // Obtener la sesión
  const date = searchParams.get('date');
  const hour = searchParams.get('hour');
  const amount = searchParams.get('amount');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
  
      console.log("Reserva realizada:", response);

      // manejar el pago
      console.log("Procesando el pago...");
  
    } catch (error: any) {
      if (error.response) {
        try {
          const errorData = await error.response.json();
          setErrorMessage(errorData.message || "Error desconocido.");
        } catch (jsonError) {
          setErrorMessage("Error desconocido.");
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
    <div className="payment-page">
      <h1 className="dark:text-white">Confirmar Pago</h1>
      <p className="dark:text-white">Fecha: {date}</p>
      <p className="dark:text-white">Hora: {hour}</p>
      <p className="dark:text-white">Total a pagar: ${amount}</p>

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}

      <button 
        onClick={handleConfirmPayment} 
        className={`submit-button dark:bg-gray-700 dark:text-white ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? 'Procesando...' : 'Confirmar y Pagar'}
      </button>
    </div>
  );
}

export default PaymentPage;
