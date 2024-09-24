import "./globals.css";
import App from "./_app";
import AuthLayout from "@/components/AuthLayout";
import Navbar from "@/components/Navbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Reservas f5',
  description: 'Reservar turnos de fútbol 5'
}

export default function RootLayout({
  children,
  signin
}: Readonly<{
  children: React.ReactNode;
  signin: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <App>
          <AuthLayout signin={signin}>
            <>
              <Navbar />
              <div className="w-full max-w-screen-2xl p-5 mx-auto">
                {children}
              </div>
            </>
          </AuthLayout>
        </App>
      </body>
    </html>
  );
}