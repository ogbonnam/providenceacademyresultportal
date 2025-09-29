import React from "react";

interface EventsCardProps {
  events: { title: string; date: string }[];
}

export default function EventsCard({ events }: EventsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex-grow flex flex-col">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Upcoming Events
      </h3>
      <div className="overflow-y-auto max-h-48 space-y-4 pr-2">
        {events.map((event, index) => (
          <div
            key={index}
            className="bg-gray-50 p-3 rounded-lg border border-gray-200"
          >
            <p className="text-sm font-medium text-gray-900">{event.title}</p>
            <p className="text-xs text-gray-500 mt-1">{event.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
