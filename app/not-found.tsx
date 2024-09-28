import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-neutral-900">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Página no encontrada</h1>
      <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Lo sentimos, la página que buscas no existe.</p>
      <p className="mt-5 text-sm text-gray-500">Serás redirigido a la página principal en 5 segundos.</p>
      <button
        className="mt-5 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        onClick={() => router.push("/")}
      >
        Volver al inicio
      </button>
    </div>
  );
}
