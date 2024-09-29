'use client'
import ReservationForm from "@/components/ReservationForm";
import useUser from "@/hooks/useUser";

const UserProfile = () => {
  const user = useUser();

  return (
    <div className="w-full border max-w-screen-lg mx-auto p-4">
      <ReservationForm />
    </div>
  );
};

export default UserProfile;
