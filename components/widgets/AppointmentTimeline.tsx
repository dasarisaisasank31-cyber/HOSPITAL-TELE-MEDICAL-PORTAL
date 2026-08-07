"use client";
import React from "react";
import { Clock, CheckCircle2, AlertCircle, Video } from "lucide-react";

interface Appointment {
  id: string;
  time: string;
  patientName: string;
  status: "COMPLETED" | "CONFIRMED" | "PENDING";
  type: "Video" | "In-Person";
}

interface AppointmentTimelineProps {
  appointments: Appointment[];
}

export const AppointmentTimeline: React.FC<AppointmentTimelineProps> = ({ appointments }) => {
  return (
    <div className="relative border-l-2 border-gray-100 dark:border-gray-800 ml-4 py-2">
      {appointments.map((apt, idx) => (
        <div 
          key={apt.id} 
          className="mb-8 ml-6 relative animate-slide-up opacity-0"
          style={{ animationDelay: `${idx * 150}ms` }}
        >
          {/* Timeline Dot */}
          <span className={`absolute flex items-center justify-center w-8 h-8 rounded-full -left-10 ring-4 ring-white dark:ring-gray-950 ${
            apt.status === "COMPLETED" ? "bg-green-100 text-green-600" :
            apt.status === "CONFIRMED" ? "bg-blue-100 text-blue-600" :
            "bg-yellow-100 text-yellow-600"
          }`}>
            {apt.status === "COMPLETED" ? <CheckCircle2 className="w-4 h-4" /> :
             apt.status === "CONFIRMED" ? <Video className="w-4 h-4" /> :
             <AlertCircle className="w-4 h-4" />}
          </span>

          <div className="glass-card p-4 rounded-xl hover-lift">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-gray-900 dark:text-white">{apt.patientName}</h4>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                apt.status === "COMPLETED" ? "text-green-700 bg-green-50" :
                apt.status === "CONFIRMED" ? "text-blue-700 bg-blue-50" :
                "text-yellow-700 bg-yellow-50"
              }`}>
                {apt.status}
              </span>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {apt.time}
              </span>
              <span className="flex items-center gap-1">
                <Video className="w-4 h-4" />
                {apt.type}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
