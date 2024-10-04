"use client";
import useUser from "@/hooks/useUser";

interface ProfilePictureProps {
  className?: string;
}

export default function ProfilePicture({ className = '' }: ProfilePictureProps) {
  const user = useUser();

  const avatarUrl = `/api/users/avatar?fullname=${user.fullname || ''}&color=${user.color || ''}`;

  return (
    <img className={className} src={avatarUrl} alt="Avatar" />
  );
}
