"use client";

import Modal from "@/components/Modal";
import { useShowMessage } from "@/hooks/useShowMessage";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";

export default function page() {
  return (
    <SignInPage />
  )
}

function SignInPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false)

  const { message, visible, showMessage } = useShowMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      usernameOrEmail,
      password,
      callbackUrl: "/",
    });

    if (result?.error) {
      showMessage(result?.error);
    } else {
      // signed in successfully
      if (typeof window != undefined) window.location.href = result?.url || "/"
    }
    setLoading(false)
  };

  return (
    <div className="shadow-lg mx-auto w-full max-w-80 flex flex-col justify-center items-center gap-5 p-3 rounded-lg m-10">
      <span className="font-bold text-2xl">Iniciar sesión</span>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col gap-1">
          <label htmlFor="usernameOrEmail">Usuario o Email</label>
          <input
            type="text"
            id="usernameOrEmail"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
            className="border"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border"
          />
        </div>
        <button disabled={loading} type="submit" className="w-full mx-auto font-medium my-5 rounded-full bg-neutral-900 text-white py-3 px-5 text-sm hover:bg-neutral-700 duration-100 flex justify-center items-center">
          {loading ? <span className="buttonLoader"></span> : "Iniciar sesión"}
        </button>
      </form>
      {visible && <span>{message}</span>}
      {/*  */}
      <Modal buttonTrigger={<button className="w-full mx-auto font-medium my-5 rounded-full bg-green-900 text-white py-3 px-5 text-sm hover:bg-green-700 duration-100 flex justify-center items-center">Registrarse</button>}>
        <RegisterPage />
      </Modal>
    </div>
  );
}

function RegisterPage() {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const { message, visible, showMessage } = useShowMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullname, username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        showMessage(data.message);
        setTimeout(() => {
          if (typeof window !== "undefined") window.location.href = "/";
        }, 1000);
      } else {
        showMessage(data.error || "Error desconocido");
      }
    } catch (error) {
      showMessage("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5 p-2 rounded-lg m-10">
      <span className="font-bold text-2xl">Registrarse</span>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col gap-1">
          <label htmlFor="fullname">Nombre Completo</label>
          <input
            type="text"
            id="fullname"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
            className="border"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="username">Nombre de Usuario</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="border"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border"
          />
        </div>
        <button
          disabled={loading}
          type="submit"
          className="w-full mx-auto font-medium my-5 rounded-full bg-neutral-900 text-white py-3 px-5 text-sm hover:bg-neutral-700 duration-100 flex justify-center items-center"
        >
          {loading ? <span className="buttonLoader"></span> : "Registrarse"}
        </button>
      </form>
      {visible && <span>{message}</span>}
    </div>
  );
}