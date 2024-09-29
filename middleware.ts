import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // Si el usuario no está autenticado, redirigir al inicio de sesión
    if (!token) {
      const url = req.nextUrl.clone();
      url.pathname = "/"; // Redirigir al inicio de sesión
      url.searchParams.set("callbackUrl", req.nextUrl.pathname); // Mantener la URL a la que intentaba acceder
      return NextResponse.redirect(url);
    }

    // Si está autenticado, permitir acceso
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Usuario autenticado si hay un token
    },
  }
);

// Configuración de las rutas que deben estar protegidas
export const config = {
  matcher: ["/send-email", "/new", "/privacy-policy", "/settings/:path*", "/reservations"],
};