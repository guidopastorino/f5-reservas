'use client'

import useUser from '@/hooks/useUser';
import Link from 'next/link';
import React, { useState } from 'react';
import ky from 'ky';
import { useShowMessage } from '@/hooks/useShowMessage';
import { useFormik } from 'formik';
import * as Yup from 'yup';

type UserRole = 'admin' | 'user';

const validationSchema = Yup.object().shape({
  from: Yup.string().email("Correo electrónico no válido").required("El campo 'De' es obligatorio"),
  asunto: Yup.string().required("El campo 'Asunto' es obligatorio"),
  contenido: Yup.string().required("El campo 'Contenido' es obligatorio"),
});

const SendEmailPageComponent = () => {
  const user = useUser();

  const currentRole: UserRole = user.role || 'user';

  const isAdmin = (role: UserRole): role is 'admin' => {
    return role === 'admin';
  };

  const { message, visible, showMessage } = useShowMessage();
  const [loading, setLoading] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      from: 'f5reservasfighiera@gmail.com',
      destinarios: '',
      asunto: '',
      contenido: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await ky.post("/api/send-email", { json: values });
        if (response.ok) {
          formik.resetForm();
        }
        showMessage("Email enviado exitosamente");
      } catch (error) {
        showMessage(error instanceof Error ? error.message : "Hubo un error al enviar el email, por favor intenta de nuevo");
      } finally {
        setLoading(false);
      }
    },
  });

  if (!isAdmin(currentRole)) {
    return (
      <div>
        <p>Oops... parece que eres un usuario intentando enviar correos..</p>
        <div><Link href={"/"}>Volver al inicio</Link></div>
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-3 justify-center items-center p-3'>
      <span className='font-bold text-3xl'>Enviar Email</span>
      <p>Envía email a algún usuario en específico o a todos!</p>

      <form onSubmit={formik.handleSubmit} className='w-full max-w-screen-md flex flex-col gap-3 justify-center items-center'>
        <FormInput
          type='text'
          placeholder='De'
          name='from'
          value={formik.values.from}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          readOnly
          className={formik.touched.from && formik.errors.from ? 'border-red-500' : 'border-black'}
        />
        {formik.touched.from && formik.errors.from && <p className="text-red-500 text-start w-full block">{formik.errors.from}</p>}

        <FormInput
          type='text'
          placeholder='Destinario/s'
          name='destinarios'
          value={formik.values.destinarios}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.destinarios && formik.errors.destinarios ? 'border-red-500' : 'border-black'}
        />
        {formik.touched.destinarios && formik.errors.destinarios && <p className="text-red-500 text-start w-full block">{formik.errors.destinarios}</p>}

        <FormInput
          type='text'
          placeholder='Asunto'
          name='asunto'
          value={formik.values.asunto}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={formik.touched.asunto && formik.errors.asunto ? 'border-red-500' : 'border-black'}
        />
        {formik.touched.asunto && formik.errors.asunto && <p className="text-red-500 text-start w-full block">{formik.errors.asunto}</p>}

        <textarea
          className={`p-3 border w-full ${formik.touched.contenido && formik.errors.contenido ? 'border-red-500' : 'border-black'}`}
          name="contenido"
          value={formik.values.contenido}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.touched.contenido && formik.errors.contenido && <p className="text-red-500 text-start w-full block">{formik.errors.contenido}</p>}

        <button className='p-2 bg-black text-white' type='submit' disabled={loading}>
          {loading ? <span className='buttonLoader'></span> : "Enviar email"}
        </button>
      </form>

      {visible && <p>{message}</p>}
    </div>
  );
};

export default SendEmailPageComponent;

type FormInputProps = {
  value?: string;
  type: string;
  placeholder: string;
  name: string;
  readOnly?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  className?: string; // Agregar className
};

const FormInput: React.FC<FormInputProps> = ({ value, type, placeholder, name, readOnly, onChange, onBlur, className }) => {
  return (
    <input
      className={`p-3 border ${className} w-full`}
      value={value}
      type={type}
      placeholder={placeholder}
      name={name}
      readOnly={readOnly}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};
