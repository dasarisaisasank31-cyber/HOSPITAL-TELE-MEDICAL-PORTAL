"use client";
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function DoctorAvailability() {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const [activeDay, setActiveDay] = useState('Monday');
  const [selectedSlots, setSelectedSlots] = useState<any>({
    Monday: ['09:00 AM', '10:00 AM', '11:00 AM'],
  });

  const toggleSlot = (slot: string) => {
    const currentSlots = selectedSlots[activeDay] || [];
    const newSlots = currentSlots.includes(slot)
      ? currentSlots.filter((s: any) => s !== slot)
      : [...currentSlots, slot];
    
    setSelectedSlots({
      ...selectedSlots,
      [activeDay]: newSlots
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">Availability Manager</h1>
            <p className="text-gray-500 text-sm mt-1">Set your weekly consulting hours and time slots.</p>
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
            Save Schedule
          </button>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row h-[500px]">
          {/* Day Selector */}
          <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-100 p-4 space-y-1">
            {days.map(day => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  activeDay === day ? 'bg-white text-blue-600 shadow-sm border border-gray-100' : 'text-gray-500 hover:bg-white/50'
                }`}
              >
                {day}
                <span className="block text-[10px] text-gray-400 font-medium">
                  {(selectedSlots[day] || []).length} slots active
                </span>
              </button>
            ))}
          </div>

          {/* Slot Grid */}
          <div className="flex-1 p-8 overflow-y-auto">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              Select slots for {activeDay}
              <span className="text-xs font-normal text-gray-400"> (Click to toggle)</span>
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {timeSlots.map(slot => (
                <button
                  key={slot}
                  onClick={() => toggleSlot(slot)}
                  className={`p-4 rounded-2xl text-sm font-bold border-2 transition-all text-center ${
                    (selectedSlots[activeDay] || []).includes(slot)
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-50 bg-white text-gray-400 hover:border-gray-100'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>

            <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-blue-900">Apply to All Working Days</h4>
                <p className="text-xs text-blue-600 mt-1">Copy these slots to Monday through Friday instantly.</p>
              </div>
              <button className="px-4 py-2 bg-white text-blue-600 rounded-lg text-xs font-bold border border-blue-200 hover:bg-blue-100 transition-all shadow-sm">
                Apply All
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
