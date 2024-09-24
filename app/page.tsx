'use client'
import useUser from "@/hooks/useUser";

const UserProfile = () => {
  const user = useUser();

  return (
    <div>
      <h1>{user.fullname}</h1>
      <p>{user.email}</p>
      <p>{user.username}</p>
    </div>
  );
};

export default UserProfile;
