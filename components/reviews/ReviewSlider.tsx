"use client"

import { ReviewProps } from '@/types/types';
import React, { useRef, useState, useEffect } from 'react'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { RxPlus } from "react-icons/rx";
import { useQuery } from 'react-query';
import CreateReviewButton from './CreateReviewButton';
import ky from 'ky';
import ReviewCard from './ReviewCard';

// Componente de slider para mostrar reviews
const ReviewSlider = () => {
  const SliderContentRef = useRef<HTMLDivElement | null>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  // Función para manejar el scroll del slider
  const handleScroll = (direction: "left" | "right") => {
    if (SliderContentRef.current) {
      const scrollAmount = SliderContentRef.current.offsetWidth / 2;
      const currentScroll = SliderContentRef.current.scrollLeft;

      if (direction === "left") {
        SliderContentRef.current.scrollTo({
          left: currentScroll - scrollAmount,
          behavior: 'smooth'
        });
      } else {
        SliderContentRef.current.scrollTo({
          left: currentScroll + scrollAmount,
          behavior: 'smooth'
        });
      }
    }
  };

  // Verificar la posición del scroll para mostrar/ocultar botones
  const checkScrollPosition = () => {
    if (SliderContentRef.current) {
      const scrollLeft = SliderContentRef.current.scrollLeft;
      const maxScrollLeft = SliderContentRef.current.scrollWidth - SliderContentRef.current.clientWidth;

      setShowLeftButton(scrollLeft > 0); // Mostrar el botón izquierdo si no está al inicio
      setShowRightButton(scrollLeft < maxScrollLeft); // Mostrar el botón derecho si no está al final
    }
  };

  // Escuchar cambios de scroll para verificar la posición
  useEffect(() => {
    const slider = SliderContentRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition(); // Verificar al montar

      return () => {
        slider.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, []);

  // Función para obtener todas las reviews
  const getAllReviews = async () => {
    try {
      const response = await ky.get("/api/reviews").json<ReviewProps[]>();
      return response;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to fetch reviews");
    }
  }

  // Usar useQuery para obtener las reviews
  const { data: reviews, error, isLoading } = useQuery<ReviewProps[], Error>(
    'reviews',
    getAllReviews,
    {
      // enabled: ,
      retry: false,
      staleTime: 0,
      refetchOnWindowFocus: true,
      cacheTime: 0,
    }
  );

  if (isLoading) return (
    <>
      <div className='w-full flex justify-start items-center gap-3 overflow-hidden'>
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className='shrink-0 w-60 h-72 bg-gray-300 rounded-lg animate-pulse'></span>
        ))}
      </div>
    </>
  );
  if (error) return <div>Error fetching reviews: {error.message}</div>;

  return (
    <>
      <p className='my-3'>Reviews <span className='p-1 text-sm text-white rounded-lg bg-blue-700'>Nuevo</span></p>

      <div className='w-full relative mb-3'>
        {/* content */}
        <div ref={SliderContentRef} className='w-full flex justify-start items-center gap-3 snap-x snap-mandatory overflow-x-auto contentSlider py-'>
          {reviews && reviews.length > 0 ? (
            reviews.map((review, i) => (
              <ReviewCard key={i} {...review} />
            ))
          ) : (
            <p>No reviews yet</p>
          )}
        </div>

        {/* buttons */}
        {showLeftButton && (
          <button
            onClick={() => handleScroll("left")}
            className='absolute top-1/2 -translate-y-1/2 left-2 w-10 h-10 rounded-full flex justify-center items-center text-xl dark:hover:bg-neutral-700 hover:bg-gray-300'
          >
            <MdKeyboardArrowLeft />
          </button>
        )}
        {showRightButton && (
          <button
            onClick={() => handleScroll("right")}
            className='absolute top-1/2 -translate-y-1/2 right-2 w-10 h-10 rounded-full flex justify-center items-center text-xl dark:hover:bg-neutral-700 hover:bg-gray-300'
          >
            <MdKeyboardArrowRight />
          </button>
        )}
      </div>

      <CreateReviewButton />
    </>
  );
}

export default ReviewSlider;
