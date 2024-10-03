"use client"

import ReservationForm from "@/components/ReservationForm";
import useUser from "@/hooks/useUser";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const page = async () => {
  const {data: session} = useSession()
  useEffect(() => console.log(session), [session])

  return (
    <div className="w-full border max-w-screen-lg mx-auto p-4">
      {/* añadir control de errores como pasarse de horas o horas negativas */}
      {session?.user._id}
      <ReservationForm />
      <img src="/cancha.webp" alt="Foto de cancha de Fútbol 5" />
    </div>
  );
};

export default page;