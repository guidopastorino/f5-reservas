"use client"
import React from 'react'
import useUser from '@/hooks/useUser'
// 
import { MdHome, MdOutlineHome, MdEmail, MdOutlineEmail, MdChecklistRtl, MdOutlinePrivacyTip, MdPrivacyTip, MdPerson, MdPersonOutline } from "react-icons/md";
import { HiOutlinePlus, HiPlus } from "react-icons/hi";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

type NavbarBottomLinkProps = {
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  route: string;
}

const NavbarBottom = () => {
  const user = useUser()

  const links: NavbarBottomLinkProps[] = [
    { icon: <MdOutlineHome />, activeIcon: <MdHome />, route: "/" },
    { icon: <MdChecklistRtl />, activeIcon: <MdChecklistRtl />, route: "/reservations" },
    { icon: <HiOutlinePlus />, activeIcon: <HiPlus />, route: "/new" },
    { icon: <MdOutlinePrivacyTip />, activeIcon: <MdPrivacyTip />, route: "/privacy-policy" },
    { icon: <MdPersonOutline />, activeIcon: <MdPerson />, route: "/settings" },
  ]


  return (
    <nav className='block md:hidden h-14 sticky bottom-0 z-50 bg-white w-full border'>
      <ul className={`flex justify-between items-center gap-3 p-4 text-2xl`}>
        {user.role == 'admin' && <NavbarBottomLink icon={<MdOutlineEmail />} activeIcon={<MdEmail />} route={"/send-email"} />}

        {links.map((el, i) => (
          <NavbarBottomLink key={i} {...el} />
        ))}
      </ul>
    </nav>
  )
}

export default NavbarBottom

const NavbarBottomLink: React.FC<NavbarBottomLinkProps> = ({ icon, activeIcon, route }) => {
  const pathname = usePathname()

  return (
    <li>
      <Link href={route} className="text-black flex justify-center items-center">
        {pathname == route ? activeIcon : icon}
      </Link>
    </li>
  )
}