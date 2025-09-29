"use client";

import React from "react";

export default function CalendarCard() {
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("en-US", options);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Calendar</h3>
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500 text-sm">{formattedDate.split(",")[0]}</p>
        <p className="text-5xl font-bold text-indigo-600">{today.getDate()}</p>
        <p className="text-gray-500 text-sm">
          {formattedDate.split(",")[1].trim()} {today.getFullYear()}
        </p>
      </div>
    </div>
  );
}
