import React from 'react';
import { createPortal } from 'react-dom';

const Tooltip = ({ children, isVisible, position }) => {
  if (!isVisible) return null;

  return createPortal(
    <div 
      className="fixed px-2 py-1 rounded-md bg-gray-700 dark:bg-white text-white dark:text-black text-xs shadow-md z-50"
      style={{
        top: position.top,
        left: `${position.left + 1}px`, 
        transform: 'translateY(-50%)',
        whiteSpace: 'nowrap'
      }}
    >
      {children}
    </div>,
    document.body
  );
};

export default Tooltip;
