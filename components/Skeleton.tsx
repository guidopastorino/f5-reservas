import React from 'react'

export default function Skeleton({ size }: { size?: number }) {
  return (
    <div className='rounded-full bg-gray-300 w-10 h-10 animate-pulse'></div>
  )
}

// items:

{/* <div className='flex flex-col gap-2 w-9/12'>
  <span className='w-11/12 bg-gray-300 h-2 rounded-full animate-pulse'></span>
  <span className='w-9/12 bg-gray-300 h-2 rounded-full animate-pulse'></span>
</div> */}