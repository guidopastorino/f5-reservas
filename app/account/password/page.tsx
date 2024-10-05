"use client"

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useShowMessage } from "@/hooks/useShowMessage";
import { useSession } from "next-auth/react";
import Link from "next/link";
import ky from "ky";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Correo electrónico no válido").required("El correo es obligatorio"),
});

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);

  const { message, visible, showMessage } = useShowMessage()

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: ForgotPasswordSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await ky.post("/api/auth/password/request-password-reset", { json: { email: values.email } })
        showMessage("Se ha enviado un enlace de recuperación a tu correo");
      } catch (error) {
        showMessage(error instanceof Error ? error.message : "Hubo un error, por favor intenta de nuevo");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div>
      <h1>Recuperar contraseña</h1>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="email">Correo Electrónico</label>
          <input
            type="email"
            id="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email ? <span>{formik.errors.email}</span> : null}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Enviando..." : "Enviar enlace"}
        </button>
      </form>
      {visible && <p>{message}</p>}
      <Link href="/">Volver al inicio</Link>
    </div>
  );
};

export default ForgotPasswordPage;