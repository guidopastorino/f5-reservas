import "./globals.css";
import App from "./_app";
import AuthLayout from "@/components/AuthLayout";
import Navbar from "@/components/Navbar";
import { Metadata } from "next";
import NavbarBottom from "@/components/NavbarBottom";

export const metadata: Metadata = {
  title: 'Reservas F5',
  description: 'Reservar turnos de fútbol 5'
}

export default function RootLayout({
  children,
  auth
}: Readonly<{
  children: React.ReactNode;
  auth: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <App>
          <AuthLayout auth={auth}>
            <>
              <Navbar />
              <div style={{ minHeight: 'calc(100dvh - 56px)' }} className="w-full max-w-screen-2xl p-5 mx-auto h-full md:mb-0 mb-14">
                {children}
              </div>
              <NavbarBottom />
            </>
          </AuthLayout>
        </App>
      </body>
    </html>
  );
}