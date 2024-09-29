"use client";

import Modal from "@/components/Modal";
import { useShowMessage } from "@/hooks/useShowMessage";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
// Form validation
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

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
    <div className="shadow-lg mx-auto w-full max-w-80 flex flex-col justify-center items-center gap-5 p-3 rounded-lg m-10">
      <span className="font-bold text-2xl">Iniciar sesión</span>

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
            <div className="flex flex-col gap-1">
              <label htmlFor="usernameOrEmail">Usuario o Email</label>
              <Field
                type="text"
                id="usernameOrEmail"
                name="usernameOrEmail"
                className="border"
              />
              <ErrorMessage
                name="usernameOrEmail"
                component="div"
                className="text-red-600"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password">Contraseña</label>
              <Field
                type="password"
                id="password"
                name="password"
                className="border"
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
              {loading ? <span className="buttonLoader"></span> : "Iniciar sesión"}
            </button>
          </Form>
        )}
      </Formik>

      {visible && <span className="text-red-600">{message}</span>}

      {/* Modal para registro */}
      <Modal
        buttonTrigger={
          <button className="w-full mx-auto font-medium my-5 rounded-full bg-green-900 text-white py-3 px-5 text-sm hover:bg-green-700 duration-100 flex justify-center items-center">
            Registrarse
          </button>
        }
      >
        <RegisterPage />
      </Modal>
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
    <div className="flex flex-col justify-center items-center gap-5 p-2 rounded-lg m-10">
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
          <Form className="w-full">
            <div className="flex flex-col gap-1">
              <label htmlFor="fullname">Nombre Completo</label>
              <Field
                type="text"
                id="fullname"
                name="fullname"
                className="border"
              />
              <ErrorMessage
                name="fullname"
                component="div"
                className="text-red-600"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="username">Nombre de Usuario</label>
              <Field
                type="text"
                id="username"
                name="username"
                className="border"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-red-600"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="email">Email</label>
              <Field
                type="email"
                id="email"
                name="email"
                className="border"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-600"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="password">Contraseña</label>
              <Field
                type="password"
                id="password"
                name="password"
                className="border"
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

      {visible && <span className="text-red-600">{message}</span>}
    </div>
  );
}