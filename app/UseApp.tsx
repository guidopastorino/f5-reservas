"use client"

import "./globals.css";
import App from "./_app";
import Navbar from "@/components/Navbar";
import NavbarBottom from "@/components/NavbarBottom";
import { usePathname } from 'next/navigation';

const UseApp = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();

  // Definir rutas en las que no quieres mostrar los Navbars
  const hideNavbarRoutes = ["/privacy-policy", "/auth", "/account/password", "/account/reset-password"];

  const shouldHideNavbar = hideNavbarRoutes.includes(pathname);

  return (
    <App>
      <>
        {!shouldHideNavbar && <Navbar />}
        <div style={{ minHeight: 'calc(100dvh - 56px)' }} className="w-full max-w-screen-2xl mx-auto h-full md:mb-0 mb-14">
          {children}
        </div>
        {!shouldHideNavbar && <NavbarBottom />}
      </>
    </App>
  )
}

export default UseApp