'use client'

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/store/user/userSlice";
import axios from "axios";

const useAuthStateListener = () => {
  const { data: session, status } = useSession(); // Obtener sesión de NextAuth
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async (userId: string) => {
      try {
        // Realizamos un fetch a nuestra API de usuarios para obtener los datos completos
        const response = await axios.get(`/api/users/${userId}`);
        const userData = response.data;

        // Actualizar el estado global con los datos del usuario
        dispatch(
          setUser({
            _id: userData._id,
            fullname: userData.fullname,
            username: userData.username,
            email: userData.email,
            color: userData.color,
            role: userData.role,
            reservations: userData.reservations,
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
          })
        );
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        // Si ocurre un error, puedes manejarlo aquí (mostrar una alerta, por ejemplo)
      }
    };

    if (status === "authenticated" && session?.user?.id) {
      // Llamar a la función de fetch si el usuario está autenticado
      fetchUserData(session.user.id);
    } else if (status === "unauthenticated") {
      // Limpiar el estado si el usuario no está autenticado
      dispatch(clearUser());
    }
  }, [status, session, dispatch]);
};

export default useAuthStateListener;
