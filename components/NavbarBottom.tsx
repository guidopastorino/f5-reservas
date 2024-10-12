"use client"
import React, { useState, useEffect } from 'react'
import useUser from '@/hooks/useUser'
// 
import { MdHome, MdOutlineHome, MdEmail, MdOutlineEmail, MdChecklistRtl, MdOutlinePrivacyTip, MdPrivacyTip, MdPerson, MdPersonOutline } from "react-icons/md";
import { BsPlusCircle, BsPlusCircleFill } from "react-icons/bs";
import { usePathname } from 'next/navigation';
import { IoIosList, IoIosListBox } from "react-icons/io";
import { BiBell, BiSolidBell } from 'react-icons/bi'
import Link from 'next/link';
import useNotifications from '@/hooks/useNotifications';

type NavbarBottomLinkProps = {
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  route: string;
}

const NavbarBottom = () => {
  const user = useUser()

  const links: NavbarBottomLinkProps[] = [
    { icon: <MdOutlineHome />, activeIcon: <MdHome />, route: "/" },
    { icon: <IoIosList />, activeIcon: <IoIosListBox />, route: "/reservations" },
    { icon: <BsPlusCircle />, activeIcon: <BsPlusCircleFill />, route: "/new" },
    { icon: <BiBell />, activeIcon: <BiSolidBell />, route: "/notifications" },
    { icon: <MdPersonOutline />, activeIcon: <MdPerson />, route: "/settings" },
  ]

  // Scroll events
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      // El usuario está desplazándose hacia abajo, ocultar
      setIsHidden(true);
    } else {
      // El usuario está desplazándose hacia arriba, mostrar
      setIsHidden(false);
    }
    setLastScrollY(currentScrollY);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const { notifications, isLoading, error, unreadNotifications } = useNotifications();

  return (
    <nav className={`
      block md:hidden h-14 fixed z-40 bg-white dark:bg-neutral-900 w-full border-t dark:border-neutral-600 duration-500
      ${isHidden ? 'bottom-[-100%]' : 'bottom-0'}
    `}>
      <ul className={`flex justify-around items-center gap-3 text-[26px] h-full`}>
        {user.role == 'admin' && <NavbarBottomLink icon={<MdOutlineEmail />} activeIcon={<MdEmail />} route={"/send-email"} />}

        {links.map((el, i) => {
          if (el.route == "/notifications") {
            // renderizar icono con sus notificaciones respectivas
            return (
              <div className='relative' key={i}>
                {unreadNotifications > 0 && (
                  <span className="text-[11px] flex justify-center items-center font-bold w-4 h-4 bg-blue-500 text-white rounded-full z-50 absolute -top-1 -right-1">{unreadNotifications}</span>
                )}
                <NavbarBottomLink {...el} />
              </div>
            )
          } else {
            return (
              <NavbarBottomLink key={i} {...el} />
            )
          }
        })}
      </ul>
    </nav>
  )
}

export default NavbarBottom

const NavbarBottomLink: React.FC<NavbarBottomLinkProps> = ({ icon, activeIcon, route }) => {
  const pathname = usePathname()

  return (
    <li className='h-full'>
      <Link href={route} className="text-black dark:text-white flex justify-center items-center h-full w-full shrink-0">
        {pathname == route ? activeIcon : icon}
      </Link>
    </li>
  )
}