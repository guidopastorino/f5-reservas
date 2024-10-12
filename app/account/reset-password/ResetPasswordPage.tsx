"use client"

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import ky from "ky";

const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").required("La contraseña es obligatoria"),
});

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const token = searchParams.get('token')

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await ky.post(`/api/auth/password/reset-password/${token}`, { json: { password: values.password } });
        setMessage("Contraseña restablecida correctamente");
        // setTimeout(() => {
        //   router.push("/login");
        // }, 2000);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Error al restablecer la contraseña");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div>
      <h1>Restablecer contraseña</h1>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="password">Nueva contraseña</label>
          <input
            type="password"
            id="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password ? <span>{formik.errors.password}</span> : null}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Restableciendo..." : "Restablecer contraseña"}
        </button>
      </form>
      {message && <p>{message}</p>}
      <Link href="/">Volver al inicio</Link>
    </div>
  );
};

export default ResetPasswordPage;
