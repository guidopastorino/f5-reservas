import React from 'react'

const page = () => {
  return (
    <div className="grid grid-cols-4 gap-3 p-3">
      <>{Array.from({ length: 20 }).map((_, i) => (
        <span key={i} className='w-full aspect-video rounded-lg dark:bg-neutral-600 bg-gray-300 animate-pulse'></span>
      ))}</>
    </div>
  )
}

export default page