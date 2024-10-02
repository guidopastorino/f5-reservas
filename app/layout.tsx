"use client"

import "./globals.css";
import App from "./_app";
import Navbar from "@/components/Navbar";
// import { Metadata } from "next";
import NavbarBottom from "@/components/NavbarBottom";
import { usePathname } from 'next/navigation';

// export const metadata: Metadata = {
//   title: 'Reservas F5',
//   description: 'Reservar turnos de fútbol 5'
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Definir rutas en las que no quieres mostrar los Navbars
  const hideNavbarRoutes = ["/auth", "/account/password", "/account/reset-password"]; 

  const shouldHideNavbar = hideNavbarRoutes.includes(pathname);

  return (
    <html lang="en">
      <body>
        <App>
          <>
            {!shouldHideNavbar && <Navbar />}
            <div style={{ minHeight: 'calc(100dvh - 56px)' }} className="w-full max-w-screen-2xl p-5 mx-auto h-full md:mb-0 mb-14">
              {children}
            </div>
            {!shouldHideNavbar && <NavbarBottom />}
          </>
        </App>
      </body>
    </html>
  );
}
