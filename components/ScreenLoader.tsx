import React from 'react'

const ScreenLoader = () => {
  return (
    <div className="flex justify-center items-center w-full h-[100dvh] bg-white dark:bg-neutral-900">
      <span className="screenLoader dark:text-white dark:bg-white dark:after:bg-white dark:before:bg-white"></span>
    </div>
  )
}

export default ScreenLoader