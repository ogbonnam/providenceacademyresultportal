import React from "react";

interface TimetableCardProps {
  timetable: { time: string; event: string }[];
}

export default function TimetableCard({ timetable }: TimetableCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Today's Timetable
      </h3>
      <div className="space-y-4">
        {timetable.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <p className="text-sm font-semibold text-indigo-600">{item.time}</p>
            <p className="text-sm text-gray-700">{item.event}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
