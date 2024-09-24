"use client";

import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function page() {
  const [tab, setTab] = useState<number>(1)

  return (
    <>
      <div>
        <div onClick={() => setTab(1)}>Sign In</div>
        <div onClick={() => setTab(2)}>Register</div>
      </div>
      {/* render tabs */}
      {(tab == 1) && <SignInPage />}
      {(tab == 2) && <RegisterPage />}
    </>
  )
}

export function SignInPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      usernameOrEmail,
      password,
      callbackUrl: "/",
    });

    if (result?.error) {
      alert(`Error en inicio de sesión: ${result?.error}`);
    } else {
      // signed in successfully
      if (typeof window != undefined) window.location.href = result?.url || "/"
    }
  };

  return (
    <div>
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="usernameOrEmail">Usuario o Email</label>
          <input
            type="text"
            id="usernameOrEmail"
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
}

export function RegisterPage() {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fullname, username, email, password }),
    });

    if (res.ok) {
      if (typeof window != undefined) window.location.href = "/"; // Redirige al usuario al inicio de sesión después del registro
    } else {
      alert("Error en el registro");
    }
  };

  return (
    <div>
      <h1>Registro de Usuario</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fullname">Nombre Completo</label>
          <input
            type="text"
            id="fullname"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="username">Nombre de Usuario</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}
