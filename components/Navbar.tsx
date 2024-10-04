'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import DropdownMenu from './DropdownMenu'
import { signOut } from 'next-auth/react'
import { IoMdFootball } from "react-icons/io";
import { BiBell } from 'react-icons/bi'
import useUser from '@/hooks/useUser'
// 
import { MdVerified } from "react-icons/md";
import Avatar from './Avatar'
// 
import { MdOutlineEmail } from "react-icons/md";
import { MdOutlinePersonOutline } from "react-icons/md";
import { BsCalendarCheck } from "react-icons/bs";
import { NavLinkProps, Notification } from '@/types/types'
import { PiDotsThreeBold } from "react-icons/pi";
// theme
import { WiMoonAltFirstQuarter } from "react-icons/wi";
import { HiOutlineMoon } from "react-icons/hi2";
import { WiDaySunny } from "react-icons/wi";
import { BsArrowLeftShort } from "react-icons/bs";
import ThemeHandler from './ThemeHandler'

const Navbar = () => {
  const links: NavLinkProps[] = [
    { title: "Inicio", route: "/" },
    { title: "Mis reservas", route: "/reservations" },
    { title: "Nueva reserva", route: "/new" },
  ]

  const user = useUser()

  return (
    <header className='hidden md:block shadow-md bg-white dark:bg-neutral-900 dark:text-white sticky top-0 left-0 right-0 w-full h-14 z-50 px-5'>
      <div className='w-full h-full max-w-screen-2xl mx-auto flex justify-between items-center'>
        <Link href={"/"}><IoMdFootball size={50} className='text-black dark:text-neutral-500' /></Link>

        <ul className='flex justify-center items-center gap-3'>
          {user.role == 'admin' && <NavLink title='Enviar emails' route='/send-email' />}

          {links.map((el, i) => (
            <NavLink key={i} {...el} />
          ))}
        </ul>

        <div className='flex justify-center items-center gap-3'>
          {/* notifications menu */}
          <DropdownMenu
            trigger={<button className='w-10 h-10 flex justify-center items-center rounded-full'>
              <BiBell />
            </button>}
          >
            <div className='flex flex-col justify-start items-start gap-0.5 w-80 max-h-96 h-[70vh] overflow-auto'>
              <div className="p-3 border-b border-neutral-700 w-full text-start sticky top-0 bg-white dark:bg-neutral-800 z-50">
                <span className='font-bold text-xl'>Notifications</span>
              </div>
              {/* content */}
              <div>
                <NotificationCard _id={''} title={'Reserva hecha'} description={'Hola, Guido! La reserva se ha efectuado exitosamente!'} type={'account'} read={false} />
                <NotificationCard _id={''} title={'Reserva hecha'} description={'Hola, Guido! La reserva se ha efectuado exitosamente!'} type={'reservation'} read={false} />
                <NotificationCard _id={''} title={'Reserva hecha'} description={'Hola, Guido! La reserva se ha efectuado exitosamente!'} type={'email'} read={false} />
                <NotificationCard _id={''} title={'Reserva hecha'} description={'Hola, Guido! La reserva se ha efectuado exitosamente!'} read={false} />
                <NotificationCard _id={''} title={'Reserva hecha'} description={'Hola, Guido! La reserva se ha efectuado exitosamente!'} read={false} />
                <NotificationCard _id={''} title={'Reserva hecha'} description={'Hola, Guido! La reserva se ha efectuado exitosamente!'} type={'reservation'} read={false} />
                <NotificationCard _id={''} title={'Reserva hecha'} description={'Hola, Guido! La reserva se ha efectuado exitosamente!'} type={'reservation'} read={false} />
              </div>
            </div>
          </DropdownMenu>

          {/* dropdown config menu */}
          <ProfileOptionsMenu />
        </div>
      </div>
    </header>
  )
}

export default Navbar

const NavLink: React.FC<NavLinkProps> = ({ title, route }) => {
  const pathname = usePathname()

  return (
    <li>
      <Link href={route} className={`${pathname == route ? '' : 'opacity-40 active:opacity-90 hover:opacity-100 duration-100'} font-medium`}>{title}</Link>
    </li>
  )
}

const ProfileOptionsMenu = () => {
  const user = useUser()

  const [currentTab, setCurrentTab] = useState<number>(1)

  return (
    <DropdownMenu
      trigger={<button className='w-10 h-10 bg-black rounded-full overflow-hidden'>
        <Avatar fullname={user.fullname || ''} color={user.color || ''} />
      </button>}
    >
      {
        // options tab
        (currentTab == 1)
          ? <>
            <div className='dark:bg-neutral-800 dark:text-white'>
              <div className='p-2 flex flex-col justify-center items-start gap-0.5'>
                <div className="flex justify-start items-center gap-1">
                  <span className="text-lg font-medium block">
                    {user.fullname}
                  </span>
                  {user.role == 'admin' && <MdVerified color='#1d9bf0' size={20} />}
                </div>
                <span className="text-md block">
                  {user.email}
                </span>
              </div>
              <ul>
                <li onClick={() => setCurrentTab(2)} className='cursor-pointer duration-75 p-2 itemStyle w-full'>Cambiar aspecto</li>
                <li className='cursor-pointer duration-75 p-2 itemStyle w-full'>
                  <Link className="w-full" href={"/settings"}>Configuración</Link>
                </li>
                <li className='cursor-pointer duration-75 p-2 itemStyle w-full' onClick={() => signOut()}>Cerrar sesion</li>
              </ul>
            </div>
          </>
          : <>
            {/* theme tab */}
            <div>
              <div className="flex justify-start items-center gap-2 bg-white dark:bg-neutral-800">
                <div onClick={() => setCurrentTab(1)}>
                  <BsArrowLeftShort className='w-9 h-9 flex justify-center items-center rounded-full itemStyle cursor-pointer text-sm' />
                </div>
                <span className='font-medium'>Atrás</span>
              </div>
              <ChangeThemeMenu />
            </div>
          </>
      }
    </DropdownMenu>
  )
}

const NotificationCard: React.FC<Notification> = ({ _id, title, description, type, read, createdAt }) => {
  return (
    <div className="relative block select-none bg-white dark:bg-neutral-800">
      <div className='w-full flex justify-center items-start gap-3 p-3 border-b border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-700'>
        {/* icon */}
        <div className='w-7 h-7 flex justify-center items-center shrink-0'>
          {type === 'email' ? (
            <MdOutlineEmail className='w-full h-full object-contain' />
          ) : type === 'reservation' ? (
            <BsCalendarCheck className='w-full h-full object-contain' />
          ) : type === 'account' ? (
            <MdOutlinePersonOutline className='w-full h-full object-contain' />
          ) : (
            <BiBell className='w-full h-full object-contain' />
          )}
        </div>
        {/* content */}
        <div className="flex flex-col justify-start items-start">
          <span className='font-bold text-lg'>{title}</span>
          <span>{description}</span>
        </div>
        {/* options btn */}
      </div>
      <div className="absolute top-2 right-2">
        <DropdownMenu trigger={<PiDotsThreeBold className='cursor-pointer' size={23} />}>
          <ul className='py-1'>
            <li className='p-2 itemStyle'>Ocultar notificación</li>
            <li className='p-2 itemStyle'>Reportar abuso</li>
          </ul>
        </DropdownMenu>
      </div>
    </div>
  );
};

const ChangeThemeMenu = () => {
  return (
    <ThemeHandler>{(currentTheme, systemTheme, changeTheme, currentIcon) => (
      <div className='dark:bg-neutral-800 dark:text-white'>
        <li onClick={() => changeTheme('light')} className={`flex justify-start items-center gap-2 itemStyle active:brightness-95 p-2 cursor-pointer ${currentTheme == 'light' ? 'bg-gray-200 dark:bg-neutral-700' : ''}`}>
          <WiDaySunny className='text-xl' />
          <span>Light</span>
        </li>
        <li onClick={() => changeTheme('dark')} className={`flex justify-start items-center gap-2 itemStyle active:brightness-95 p-2 cursor-pointer ${currentTheme == 'dark' ? 'bg-gray-200 dark:bg-neutral-700' : ''}`}>
          <HiOutlineMoon className='text-xl' />
          <span>Dark</span>
        </li>
        <li onClick={() => changeTheme('system')} className={`flex justify-start items-center gap-2 itemStyle active:brightness-95 p-2 cursor-pointer ${currentTheme == 'system' ? 'bg-gray-200 dark:bg-neutral-700' : ''}`}>
          <WiMoonAltFirstQuarter className='text-xl' />
          <span>System</span>
        </li>
      </div>
    )}</ThemeHandler>
  )
}