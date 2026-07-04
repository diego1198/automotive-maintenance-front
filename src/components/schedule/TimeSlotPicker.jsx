import React from 'react';

const TimeSlotPicker = ({ slots = [], selected, onSelect }) => {
  // Validar que slots sea un array
  if (!Array.isArray(slots)) {
    return (
      <div className="flex items-center justify-center p-4 text-gray-500">
        <p className="text-sm">No hay horarios disponibles</p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="flex items-center justify-center p-4 text-gray-500">
        <p className="text-sm">No hay horarios disponibles</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {slots.map((slot) => (
        <button
          key={slot}
          className={`relative px-4 py-3 rounded-xl border-2 font-medium transition-all duration-200 focus-ring ${
            selected === slot 
              ? 'bg-primary-600 text-white border-primary-600 shadow-lg transform scale-105 ring-2 ring-primary-200' 
              : 'bg-white text-gray-700 border-gray-200 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 hover:shadow-md hover:scale-102'
          }`}
          onClick={() => onSelect(slot)}
        >
          {selected === slot && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 rounded-full flex items-center justify-center">
              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          <span className="text-sm font-semibold">{slot}</span>
        </button>
      ))}
    </div>
  );
};

export default TimeSlotPicker;
