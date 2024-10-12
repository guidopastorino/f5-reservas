'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import DropdownMenu from './DropdownMenu'
import { signOut, useSession } from 'next-auth/react'
import { IoMdFootball } from "react-icons/io";
import useUser from '@/hooks/useUser'
import { MdVerified } from "react-icons/md";
import { NavLinkProps } from '@/types/types'
import { WiMoonAltFirstQuarter } from "react-icons/wi";
import { HiOutlineMoon } from "react-icons/hi2";
import { WiDaySunny } from "react-icons/wi";
import { BsArrowLeftShort } from "react-icons/bs";
import ThemeHandler from './ThemeHandler'
import ProfilePicture from './ProfilePicture'
import useNotifications from '@/hooks/useNotifications'
import NotificationList from './notification/NotificationList'
import { BiBell } from 'react-icons/bi'
import Skeleton from './Skeleton'

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
          <NotificationsMenu />

          {/* dropdown config menu */}
          <ProfileOptionsMenu />
        </div>
      </div>
    </header>
  )
}

export default Navbar

// Links
const NavLink: React.FC<NavLinkProps> = ({ title, route }) => {
  const pathname = usePathname()

  return (
    <li>
      <Link href={route} className={`${pathname == route ? '' : 'opacity-40 active:opacity-90 hover:opacity-100 duration-100'} font-medium`}>{title}</Link>
    </li>
  )
}

// NotificationsMenu dropdown
const NotificationsMenu = () => {
  const { notifications, isLoading, error, unreadNotifications, totalNotifications, session } = useNotifications();

  if (!session?.user.id) return <Skeleton />

  return (
    <DropdownMenu trigger={
      <button className="w-10 h-10 flex justify-center items-center rounded-full relative border">
        <BiBell />
        {unreadNotifications > 0 && (
          <span className="text-[12px] flex justify-center items-center font-bold w-5 h-5 bg-blue-500 text-white rounded-full z-50 absolute -top-1 -right-1">{unreadNotifications > 9 ? '+9' : unreadNotifications}</span>
        )}
      </button>
    }>
      <div className="w-96 max-h-[400px] h-[70vh] overflow-auto">
        {isLoading && <p>Cargando...</p>}
        {error && <p>Error al cargar: {error.message}</p>}
        {notifications && (
          <NotificationList notifications={notifications} />
        )}
      </div>
    </DropdownMenu>
  );
};

const ProfileOptionsMenu = () => {
  const user = useUser()

  const [currentTab, setCurrentTab] = useState<number>(1)

  if (!user || !user._id) return <Skeleton />

  return (
    <DropdownMenu
      trigger={<button className='w-10 h-10 border rounded-full overflow-hidden'>
        <ProfilePicture className='w-10 h-10 object-contain' />
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