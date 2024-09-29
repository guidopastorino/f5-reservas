'use client'
import ReservationForm from "@/components/ReservationForm";
import useUser from "@/hooks/useUser";

const page = () => {
  return (
    <div className="w-full border max-w-screen-lg mx-auto p-4">
      {/* añadir control de errores como pasarse de horas o horas negativas */}
      <ReservationForm />
    </div>
  );
};

export default page;