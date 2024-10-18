"use client"

import React, { useState } from 'react';

interface SmoothDialogProps {
  trigger: React.ReactNode; // Componente que abre el diálogo
  dialogContent: React.ReactNode; // Contenido del diálogo
}

const SmoothDialog: React.FC<SmoothDialogProps> = ({ trigger, dialogContent }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleDialog = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <div onClick={toggleDialog} style={{ cursor: 'pointer' }}>
        {trigger}
      </div>
      <div
        className={`dialog ${isOpen ? 'open' : ''}`}
        style={{
          maxHeight: isOpen ? '200px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.5s ease-in-out',
        }}
      >
        {dialogContent}
      </div>
    </div>
  );
};

export default SmoothDialog;