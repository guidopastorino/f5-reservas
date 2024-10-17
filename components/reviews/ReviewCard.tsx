import { ReviewProps } from '@/types/types';
import Link from 'next/link';
import React from 'react';
import DropdownMenu from '../DropdownMenu';
import { PiDotsThreeBold } from 'react-icons/pi';
import ky from 'ky';
import Modal from '../Modal';
import { useQueryClient } from 'react-query';
import useUser from '@/hooks/useUser';

const ReviewCard: React.FC<ReviewProps> = ({
  _id,
  fullname,
  username,
  review,
  stars,
  createdAt,
  updatedAt,
}) => {
  const user = useUser()

  const queryClient = useQueryClient();

  // Función para eliminar la review de forma optimista
  const deleteReview = async () => {
    // Guardar el estado previo por si hay que restaurarlo
    const previousReviews = queryClient.getQueryData<ReviewProps[]>('reviews');

    // Actualización optimista: remover la review de la caché local
    queryClient.setQueryData('reviews', (oldReviews: ReviewProps[] | undefined) =>
      oldReviews ? oldReviews.filter((review) => review._id !== _id) : []
    );

    try {
      // Hacer la petición de eliminación
      await ky.delete(`/api/reviews/${_id}`).json();
      console.log("Review con id " + _id + " eliminada");
    } catch (error) {
      console.error("Error eliminando la review:", error);
      // Si hay un error, restaurar el estado previo
      queryClient.setQueryData('reviews', previousReviews);
    }
  };

  return (
    <div className='relative shrink-0 flex items-start gap-3 p-3 rounded-lg border border-gray-300 shadow-lg hover:shadow-xl md:transition-shadow duration-200'>
      <div>
        <img
          className='w-10 h-10 rounded-full object-cover'
          src='/default-profile-picture.svg'
          alt='Profile Picture'
        />
        <div className='flex-1'>
          <div className='flex items-center justify-between'>
            <span className='font-semibold text-md'>{username}</span>
            <span className='text-sm text-gray-500'>
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className='mt-2 text-gray-700 text-lg'>{review}</p>
          <div className='flex items-center mt-2'>
            {/* Aquí podrías agregar un sistema de estrellas */}
            <span className='text-yellow-500 text-lg'>
              {'★'.repeat(stars) + '☆'.repeat(5 - stars)}
            </span>
          </div>
        </div>
      </div>

      {user.username == username && <div className="absolute top-2 right-2">
        <DropdownMenu trigger={<PiDotsThreeBold className='cursor-pointer' size={23} />}>
          <ul className='py-1'>
            <li className='p-2 itemStyle' onClick={deleteReview}>Eliminar reseña</li>
          </ul>
        </DropdownMenu>
      </div>}
    </div>
  );
};

export default ReviewCard;