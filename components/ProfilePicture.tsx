"use client";
import { useState } from "react";
import useUser from "@/hooks/useUser";

interface ProfilePictureProps {
  className?: string;
}

export default function ProfilePicture({ className = '' }: ProfilePictureProps) {
  const user = useUser();

  const [imageLoaded, setImageLoaded] = useState(false); // Controla si la imagen está cargada
  const [imageSrc, setImageSrc] = useState('/default-profile-picture.svg');
  
  const avatarUrl = `/api/users/avatar?fullname=${user.fullname || ''}&color=${user.color || ''}`;

  // Cuando la imagen de la API se carga con éxito
  const handleImageLoad = () => {
    setImageSrc(avatarUrl);
    setImageLoaded(true); // Marcar como cargada
  };

  // Si hay un error cargando la imagen de la API
  const handleImageError = () => {
    setImageSrc('/default-profile-picture.svg');
    setImageLoaded(true); // También marca como cargada si hay error
  };

  return (
    <div className="profile-picture-wrapper">
      {!imageLoaded && <div className="circular-loader"></div>} {/* Loader circular */}
      <img
        className={`profile-picture ${imageLoaded ? 'loaded' : ''} ${className}`}
        src={imageSrc}
        alt="Avatar"
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ display: imageLoaded ? 'block' : 'none' }} // Ocultar mientras carga
      />
    </div>
  );
}
