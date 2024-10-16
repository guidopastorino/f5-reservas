import { ReviewProps } from '@/types/types';
import Link from 'next/link';
import React from 'react';

const ReviewCard: React.FC<ReviewProps> = ({
  _id,
  fullname,
  username,
  review,
  stars,
  createdAt,
  updatedAt,
}) => {
  return (
    <Link
      href={`/review/${_id}`}
      className='shrink-0 flex items-start gap-3 p-3 rounded-lg border border-gray-300 shadow-lg hover:shadow-xl md:transition-shadow duration-200'
    >
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
    </Link>
  );
};

export default ReviewCard;