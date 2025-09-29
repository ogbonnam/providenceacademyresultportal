"use client";

import React, { useMemo } from "react";
// Import all necessary types and data from the central timetable file
import {
  DayOfWeek,
  TimeSlot,
  TimetableEntry,
  days,
  timeSlots,
  formatTimeSlot,
} from "@/types/timetable";

interface FullTimetableCardProps {
  timetable: TimetableEntry[];
}

/**
 * Renders a complete weekly timetable in a grid format.
 * This is designed for an admin overview, showing all subjects and teachers for the week.
 */
export default function FullTimetableCard({
  timetable,
}: FullTimetableCardProps) {
  // Use a memoized map for efficient lookup of timetable entries
  const timetableMap = useMemo(() => {
    const map = new Map<string, TimetableEntry>();
    timetable.forEach((entry) => {
      map.set(`${entry.day}-${entry.time}`, entry);
    });
    return map;
  }, [timetable]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-full overflow-x-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Weekly Timetable</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Day / Time
            </th>
            {timeSlots.map((slot) => (
              <th
                key={slot}
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {formatTimeSlot(slot)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {days.map((day) => (
            <tr key={day}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {day.charAt(0) + day.slice(1).toLowerCase()}
              </td>
              {timeSlots.map((time) => {
                const entry = timetableMap.get(`${day}-${time}`);
                const isBreak = time.includes("BREAK");

                return (
                  <td
                    key={`${day}-${time}`}
                    className={`
                      px-6 py-4 whitespace-nowrap text-sm text-gray-900 border
                      ${isBreak ? "bg-gray-200 italic text-gray-500" : ""}
                    `}
                  >
                    {isBreak ? (
                      <div className="flex justify-center items-center h-full">
                        {formatTimeSlot(time)}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-center">
                        <span className="font-bold">
                          {entry?.subject?.name || "N/A"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {entry?.teacher?.name || ""}
                        </span>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
