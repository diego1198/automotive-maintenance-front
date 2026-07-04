import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';

const Calendar = ({ selectedDate, onSelectDate }) => {
  const today = new Date();
  const days = eachDayOfInterval({ start: startOfMonth(today), end: endOfMonth(today) });

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((day) => {
        const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
        
        return (
          <button
            key={day}
            className={`relative p-3 rounded-xl border-2 font-medium transition-all duration-200 focus-ring ${
              isSelected
                ? 'bg-primary-600 text-white border-primary-600 shadow-lg transform scale-105 ring-2 ring-primary-200'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 hover:shadow-md hover:scale-102'
            }`}
            onClick={() => onSelectDate(day)}
          >
            {isSelected && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 rounded-full flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
            <span className="text-sm font-semibold">{format(day, 'd')}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Calendar;
