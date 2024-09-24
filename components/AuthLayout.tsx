'use client'

import { useSession } from 'next-auth/react';
import React from 'react'
import ScreenLoader from '@/components/ScreenLoader';

const AuthLayout = ({
  children,
  signin
}: Readonly<{
  children: React.ReactNode;
  signin: React.ReactNode;
}>) => {
  const { status } = useSession()

  if (status == 'loading') return <ScreenLoader />

  return (
    <>
      {
        status == 'authenticated'
          ? (
            <>{
              <>
                {children}
              </>
            }</>
          )
          : (
            <>{signin}</>
          )
      }
    </>
  )
}

export default AuthLayout