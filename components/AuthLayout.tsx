'use client'

import { useSession } from 'next-auth/react';
import React from 'react'
import ScreenLoader from '@/components/ScreenLoader';

const AuthLayout = ({
  children,
  auth
}: Readonly<{
  children: React.ReactNode;
  auth: React.ReactNode;
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
            <>{auth}</>
          )
      }
    </>
  )
}

export default AuthLayout