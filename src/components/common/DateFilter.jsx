import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';

const DateFilter = ({ label, value, onChange }) => {
  return (
    <div className="flex flex-col w-full md:w-auto">
      <label className="text-blue-400 dark:text-blue-700 font-bold mb-1">
        {label}:
      </label>
      <div className="relative w-full">
        <input
          type="date"
          value={value.toISOString().split('T')[0]}
          onChange={(e) => onChange(new Date(e.target.value))}
          className="border border-gray-600 dark:border-gray-300 rounded-full px-4 py-2 pr-10 
                     shadow-[4px_4px_10px_rgba(0,0,0,0.3)] focus:outline-none focus:ring-2 
                     focus:ring-blue-400 focus:border-blue-400 bg-gray-700 dark:bg-white 
                     text-white dark:text-black w-full"
        />
      </div>
    </div>
  );
};

export default DateFilter;
