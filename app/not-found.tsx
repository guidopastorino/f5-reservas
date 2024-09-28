import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <>
      <div>404 route not found</div>
      <Link href={"/"}>Back</Link>
    </>
  )
}

export default page