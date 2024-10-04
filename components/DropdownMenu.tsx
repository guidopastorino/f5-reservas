"use client"

import React, { useEffect, useRef, useState } from 'react';

type DropdownMenuProps = {
  trigger: React.ReactNode; // El elemento que abrirá el menú (puede ser un botón, un avatar, etc.)
  children: React.ReactNode; // El contenido del menú desplegable
};

const DropdownMenu = ({ trigger, children }: DropdownMenuProps) => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const buttonRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Cerrar el menú si se hace click fuera de él
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current?.contains(event.target as Node)) return;
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    // Verificar si el menú sobresale de la pantalla y ajustarlo si es necesario
    const adjustMenuPosition = () => {
      const menu = menuRef.current;
      if (menu) {
        const { right, bottom } = menu.getBoundingClientRect();

        // Si el menú sobresale por la derecha, lo ajustamos hacia la izquierda
        if (right > window.innerWidth) {
          menu.style.right = '0';
          menu.style.left = 'auto';
        }

        // Si el menú sobresale por la parte inferior, lo ajustamos hacia arriba
        if (bottom > window.innerHeight) {
          menu.style.top = 'auto';
          menu.style.bottom = 'calc(100% + 5px)';
        }
      }
    };

    if (menuOpen) {
      adjustMenuPosition();
    }
  }, [menuOpen]);

  return (
    <div className="relative">
      {/* El botón (o cualquier elemento) que activa el menú */}
      <div ref={buttonRef} onClick={() => setMenuOpen(!menuOpen)}>
        {trigger}
      </div>

      {/* El menú desplegable */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 shadow-lg z-40 bg-white dark:bg-neutral-800"
          style={{ top: 'calc(100% + 5px)', minWidth: '200px' }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
