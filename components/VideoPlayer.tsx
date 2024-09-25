import React, { useRef, useState } from "react";

const VideoPlayer = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  // Función para generar las miniaturas
  const generateThumbnails = async (video: HTMLVideoElement) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const duration = video.duration;
    const numThumbnails = 10; // Cantidad de miniaturas que quieres generar
    const interval = duration / numThumbnails; // Intervalo en segundos

    const thumbnailArray: string[] = [];

    for (let i = 0; i <= numThumbnails; i++) {
      // Saltar al tiempo en el video
      video.currentTime = interval * i;

      // Aguardar un momento para que el video actualice el frame
      await new Promise((resolve) => {
        video.onseeked = () => {
          // Dibujar el frame en el canvas
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          // Obtener la miniatura como data URL
          const thumbnail = canvas.toDataURL("image/jpeg");
          thumbnailArray.push(thumbnail);
          resolve(null);
        };
      });
    }

    setThumbnails(thumbnailArray);
  };

  // Manejador cuando se selecciona un video
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoURL = URL.createObjectURL(file);
      const videoElement = videoRef.current;
      if (videoElement) {
        videoElement.src = videoURL;
        videoElement.onloadedmetadata = () => {
          generateThumbnails(videoElement);
        };
      }
    }
  };

  return (
    <div>
      <h1>Video Player con Miniaturas</h1>
      <input type="file" accept="video/*" onChange={handleVideoUpload} />
      <video ref={videoRef} controls width="600" style={{ display: "block" }} />

      <div className="thumbnails" style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
        {thumbnails.map((thumbnail, index) => (
          <img key={index} src={thumbnail} alt={`thumbnail-${index}`} style={{ width: "120px", height: "auto" }} />
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;
