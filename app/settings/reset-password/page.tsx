"use client"

import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { useSearchParams } from "next/navigation";

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
        const response = await axios.post(`/api/auth/password/reset-password/${token}`, { password: values.password });
        setMessage("Contraseña restablecida correctamente");
        // setTimeout(() => {
        //   router.push("/login");
        // }, 2000);
      } catch (error) {
        setMessage("Error al restablecer la contraseña");
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
    </div>
  );
};

export default ResetPasswordPage;
