import React from 'react';

const CustomButton = ({ label, onClick, color = '#7F9AE5', disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-5 py-2.5 rounded-xl font-semibold transition duration-500
        text-white dark:text-black backdrop-blur-md
        shadow-[inset_2px_2px_6px_rgba(255,255,255,0.4),inset_-3px_-3px_6px_rgba(0,0,0,0.2),0_8px_20px_rgba(0,0,0,0.35)]
        hover:shadow-[0_12px_24px_rgba(0,0,0,0.45),inset_1px_1px_3px_rgba(255,255,255,0.2)]
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      style={{
        backgroundColor: color,
      }}
    >
      {label}
    </button>
  );
};


export default CustomButton;
