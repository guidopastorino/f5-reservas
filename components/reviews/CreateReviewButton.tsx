"use client";

import React from 'react';
import Modal from '../Modal';
import { RxPlus } from 'react-icons/rx';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useUser from '@/hooks/useUser';
import { useShowMessage } from '@/hooks/useShowMessage';
import ky, { HTTPError } from 'ky';
import { useQueryClient } from 'react-query';
import { ReviewProps } from '@/types/types';

interface ErrorMessage {
  message: string;
}

const CreateReviewButton = () => {
  const user = useUser();
  const { message, visible, showMessage } = useShowMessage();
  const queryClient = useQueryClient();

  const formik = useFormik({
    initialValues: {
      review: '',
      stars: 0,
    },
    validationSchema: Yup.object({
      review: Yup.string()
        .required('La reseña es obligatoria')
        .max(100, 'La reseña no puede tener más de 100 caracteres'),
      stars: Yup.number()
        .required('Las estrellas son obligatorias')
        .min(1, 'Las estrellas deben ser al menos 1')
        .max(5, 'Las estrellas no pueden ser más de 5'),
    }),
    onSubmit: async (values) => {
      const existingReviews = queryClient.getQueryData<ReviewProps[]>('reviews');

      // Verificar si el usuario ya tiene una reseña
      const userAlreadyReviewed = existingReviews?.some(
        (review) => review.username === user.username
      );

      if (userAlreadyReviewed) {
        // Mostrar mensaje de error y no permitir la creación
        showMessage('Ya tienes una reseña creada.');
        return;
      }

      // Creación optimista de la review
      const newReview: ReviewProps = {
        _id: Math.random().toString(36).substring(7), // Genera un id temporal
        fullname: user.fullname || '',
        username: user.username || '',
        review: values.review,
        stars: Number(values.stars),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Guardar el estado previo por si necesitamos revertirlo
      const previousReviews = queryClient.getQueryData<ReviewProps[]>('reviews');

      // Actualizar la caché local de manera optimista
      queryClient.setQueryData('reviews', (oldReviews: ReviewProps[] | undefined) => 
        oldReviews ? [...oldReviews, newReview] : [newReview]
      );

      try {
        // Intentar enviar la reseña al servidor
        await ky.post("/api/reviews", { json: newReview }).json();

        // Si es exitoso, restablecer el formulario
        formik.resetForm();
      } catch (error) {
        // Si hay un error, revertir el cambio optimista
        queryClient.setQueryData('reviews', previousReviews);

        // Manejar el error
        if (isKyError(error) && error.response) {
          const errorMessage = await error.response.json(); // Capturar el mensaje de error
          if (isErrorMessage(errorMessage)) {
            showMessage(errorMessage.message); // Mostrar el mensaje del servidor
          } else {
            showMessage("Error desconocido del servidor.");
          }
        } else {
          showMessage(error instanceof Error ? error.message : "Error al crear la reseña");
        }
      }
    },
  });

  // Type guard para verificar si el error es de Ky
  function isKyError(error: unknown): error is HTTPError {
    return (error as any).response !== undefined; // Verifica si el error tiene la propiedad response
  }

  // Type guard para verificar si el errorMessage es de tipo ErrorMessage
  function isErrorMessage(errorMessage: unknown): errorMessage is ErrorMessage {
    return (errorMessage as ErrorMessage).message !== undefined; // Verifica si tiene la propiedad message
  }

  return (
    <Modal
      buttonTrigger={
        <button className='py-2 px-3 rounded-full flex justify-center items-center gap-2 dark:hover:bg-neutral-800 hover:bg-gray-200 active:brightness-90 border dark:border-neutral-800'>
          <RxPlus />
          <span>Crear una reseña</span>
        </button>
      }
    >
      <div className='p-2 bg-white dark:bg-neutral-800'>
        <span className='font-medium text-xl'>Crear una reseña</span>

        <form onSubmit={formik.handleSubmit}>
          {/* Reseña */}
          <div className='mb-4'>
            <label htmlFor='review' className='block text-sm font-medium'>Reseña</label>
            <textarea
              id='review'
              name='review'
              rows={4}
              className={`mt-1 p-2 border rounded-md w-full ${formik.errors.review && formik.touched.review ? 'border-red-500' : 'border-gray-300'}`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.review}
            />
            {formik.touched.review && formik.errors.review ? (
              <div className='text-red-500 text-sm'>{formik.errors.review}</div>
            ) : null}
          </div>

          {/* Estrellas */}
          <div className='mb-4'>
            <label htmlFor='stars' className='block text-sm font-medium'>Estrellas</label>
            <input
              id='stars'
              name='stars'
              type='number'
              min="1"
              max="5"
              className={`mt-1 p-2 border rounded-md w-full ${formik.errors.stars && formik.touched.stars ? 'border-red-500' : 'border-gray-300'}`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.stars}
            />
            {formik.touched.stars && formik.errors.stars ? (
              <div className='text-red-500 text-sm'>{formik.errors.stars}</div>
            ) : null}
          </div>

          <button type='submit' className='py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600'>
            Enviar Reseña
          </button>
        </form>

        {/* message */}
        {visible && <span>{message}</span>}
      </div>
    </Modal>
  );
};

export default CreateReviewButton;
