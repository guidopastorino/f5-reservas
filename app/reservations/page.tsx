'use client'

import useUser from '@/hooks/useUser'
import { ReservationProps } from '@/types/types'
import axios from 'axios'
import React, { useState } from 'react'
import { useQuery } from 'react-query'

const page = () => {
  const user = useUser()

  return (
    <div className="w-full border max-w-screen-lg mx-auto p-4">
      {(user.reservations.length == 0)
        ? <>No hay reservaciones hechas todavía</>
        : <UserReservations reservationIds={user.reservations} />
      }
    </div>
  )
}

export default page


const UserReservations = ({ reservationIds }: { reservationIds: string[] }) => {
  const [reservations, setReservations] = useState<ReservationProps[]>([])

  const fetchUserReservations = async () => {
    const response = await axios.get(`/api/reservations/`)
  }

  return (
    <>
      {reservations.map((el, i) => {

      })}
    </>
  )
}


const ReservationCard: React.FC<ReservationProps> = ({ }) => {
  return (
    <>
      {status}
    </>
  )
}