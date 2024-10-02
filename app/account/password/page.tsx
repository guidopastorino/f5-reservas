"use client"

import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useShowMessage } from "@/hooks/useShowMessage";
import { useSession } from "next-auth/react";
import Link from "next/link";

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
        const response = await axios.post("/api/auth/password/request-password-reset", { email: values.email });
        showMessage("Se ha enviado un enlace de recuperación a tu correo");
      } catch (error) {
        console.log(error)
        showMessage("Hubo un error, por favor intenta de nuevo");
      } finally {
        setLoading(false);
      }
    },
  });

  const { data: session } = useSession()

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