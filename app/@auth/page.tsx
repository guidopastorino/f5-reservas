"use client";

import Modal from "@/components/Modal";
import { useShowMessage } from "@/hooks/useShowMessage";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
// Form validation
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";

export default function page() {
  return (
    <SignInPage />
  )
}

// Sign In
const SignInSchema = Yup.object().shape({
  usernameOrEmail: Yup.string()
    .required("El nombre de usuario o email es obligatorio"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")  // Nueva validación
    .required("La contraseña es obligatoria"),
});

function SignInPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const { message, visible, showMessage } = useShowMessage();

  const handleSubmit = async (values: { usernameOrEmail: string; password: string }) => {
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      usernameOrEmail: values.usernameOrEmail,
      password: values.password,
      callbackUrl: "/",
    });

    if (result?.error) {
      showMessage(result?.error);
    } else {
      if (typeof window !== "undefined") window.location.href = result?.url || "/";
    }
    setLoading(false);
  };

  return (
    <div className="sm:shadow-lg mx-auto sm:my-10 w-full max-w-80 flex flex-col justify-center items-center gap-2 p-3 sm:rounded-lg">
      <span className="font-bold text-3xl sm:text-2xl m-4 sm:m-0">Iniciar sesión</span>

      <Formik
        initialValues={{
          usernameOrEmail: "",
          password: "",
        }}
        validationSchema={SignInSchema} // Aplicamos la validación con Yup
        onSubmit={handleSubmit} // Se maneja el submit con Formik
      >
        {({ isSubmitting }) => (
          <Form className="w-full">
            <div className="flex flex-col gap-1 mb-2">
              <Field
                type="text"
                id="usernameOrEmail"
                name="usernameOrEmail"
                className="formInput"
                placeholder="Usuario o Email"
              />
              <ErrorMessage
                name="usernameOrEmail"
                component="div"
                className="text-red-600"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Field
                type="password"
                id="password"
                name="password"
                className="formInput"
                placeholder="Contraseña"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-600"
              />
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <button
                disabled={loading || isSubmitting}
                type="submit"
                className="w-full mx-auto font-medium rounded-full bg-neutral-900 text-white dark:bg-neutral-800 py-3 px-5 text-sm dark:hover:bg-neutral-600 hover:bg-neutral-700 duration-100 flex justify-center items-center"
              >
                {loading ? <span className="buttonLoader"></span> : "Iniciar sesión"}
              </button>
            </div>
          </Form>
        )}
      </Formik>

      <Link href={"/settings/password"} className="block w-full text-start text-sm dark:text-neutral-500 select-none underline-none hover:underline">Has olvidado tu contraseña?</Link>

      {visible && <span className="text-red-600">{message}</span>}

      <hr className="w-full h-[1px] border-none bg-neutral-300 dark:bg-neutral-700 my-4" />

      <Modal
        buttonTrigger={
          <button className="w-full mx-auto font-medium rounded-full bg-green-900 text-white py-3 px-5 text-sm hover:bg-green-700 duration-100 flex justify-center items-center">
            Registrarse
          </button>
        }
      >
        <RegisterPage />
      </Modal>

      {/* sign in with google */}
      <button className="w-full mx-auto font-medium rounded-full bg-gray-50 border py-3 px-5 text-sm hover:bg-gray-100 duration-100 flex justify-start items-center gap-3 whitespace-nowrap text-ellipsis overflow-hidden line-clamp-1">
        <img className="w-6 h-6 object-contain shrink-0" src="google-logo.webp" />
        <span className="text-black">Iniciar sesión con Google</span>
      </button>
    </div>
  );
}

// Register
const RegisterSchema = Yup.object().shape({
  fullname: Yup.string()
    .required("El nombre completo es obligatorio"),
  username: Yup.string()
    .min(3, "El nombre de usuario debe tener al menos 3 caracteres")
    .required("El nombre de usuario es obligatorio"),
  email: Yup.string()
    .email("El email no es válido")
    .required("El email es obligatorio"),
  password: Yup.string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .matches(/[A-Z]/, "La contraseña debe tener al menos una letra mayúscula")
    .matches(/\d/, "La contraseña debe tener al menos un número")
    .required("La contraseña es obligatoria"),
});

function RegisterPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const { message, visible, showMessage } = useShowMessage();

  const handleSubmit = async (values: { fullname: string; username: string; email: string; password: string }) => {
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
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
    <div className="flex flex-col justify-center items-center gap-5 rounded-lg p-10 bg-white dark:bg-neutral-800">
      <span className="font-bold text-2xl">Registrarse</span>

      <Formik
        initialValues={{
          fullname: "",
          username: "",
          email: "",
          password: "",
        }}
        validationSchema={RegisterSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="w-full flex items-stretch gap-3 flex-col">
            <div className="flex flex-col gap-1">
              <Field
                type="text"
                id="fullname"
                name="fullname"
                className="formInput"
                placeholder="Nombre Completo"
              />
              <ErrorMessage
                name="fullname"
                component="div"
                className="text-red-600"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Field
                type="text"
                id="username"
                name="username"
                className="formInput"
                placeholder="Nombre de Usuario"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-red-600"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Field
                type="email"
                id="email"
                name="email"
                className="formInput"
                placeholder="Email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-600"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Field
                type="password"
                id="password"
                name="password"
                className="formInput"
                placeholder="Contraseña"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-600"
              />
            </div>
            <button
              disabled={loading || isSubmitting}
              type="submit"
              className="w-full mx-auto font-medium my-5 rounded-full bg-neutral-900 text-white py-3 px-5 text-sm hover:bg-neutral-700 duration-100 flex justify-center items-center"
            >
              {loading ? <span className="buttonLoader"></span> : "Registrarse"}
            </button>
          </Form>
        )}
      </Formik>

      {visible && <span>{message}</span>}
    </div>
  );
}