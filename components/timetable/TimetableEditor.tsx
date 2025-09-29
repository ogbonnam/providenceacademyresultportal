// components/timetable/TimetableEditor.tsx
"use client";

import React, { useState, useTransition, useMemo } from "react";
import { saveTimetableEntry } from "@/app/actions/timetable";
import { DayOfWeek, TimeSlot } from "@prisma/client";

interface Teacher {
  id: string;
  name: string | null;
}

interface Subject {
  id: string;
  name: string;
}

interface TimetableEntry {
  id: string;
  day: DayOfWeek;
  time: TimeSlot;
  subjectId: string | null;
  teacherId: string | null;
  subject: Subject | null;
  teacher: Teacher | null;
}

interface TimetableEditorProps {
  initialTimetable: TimetableEntry[];
  teachers: Teacher[];
  subjects: Subject[];
}

// Define the days of the week and time slots
const days: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

const timeSlots: TimeSlot[] = [
  "TIME_08_30_09_30",
  "TIME_09_30_10_30",
  "TIME_10_30_11_00_BREAK",
  "TIME_11_00_12_00",
  "TIME_12_00_13_00",
  "TIME_13_00_14_00_BREAK",
  "TIME_14_00_15_00",
];

const formatTimeSlot = (slot: TimeSlot) => {
  // Convert enum to a more readable string
  const formatted = slot.replace(/TIME_/, "").replace(/_/g, " ").trim();
  return formatted.includes("BREAK")
    ? formatted.replace("BREAK", "(Break)")
    : formatted;
};

export default function TimetableEditor({
  initialTimetable,
  teachers,
  subjects,
}: TimetableEditorProps) {
  const [timetable, setTimetable] =
    useState<TimetableEntry[]>(initialTimetable);
  const [selectedCell, setSelectedCell] = useState<{
    day: DayOfWeek;
    time: TimeSlot;
  } | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleCellClick = (day: DayOfWeek, time: TimeSlot) => {
    // Prevent clicking on break slots
    if (time.includes("BREAK")) {
      return;
    }

    setSelectedCell({ day, time });

    const entry = timetable.find((e) => e.day === day && e.time === time);
    setSelectedSubjectId(entry?.subjectId || "");
    setSelectedTeacherId(entry?.teacherId || "");
  };

  const handleSave = () => {
    if (!selectedCell) return;

    startTransition(async () => {
      const result = await saveTimetableEntry(
        selectedCell.day,
        selectedCell.time,
        selectedSubjectId || null,
        selectedTeacherId || null
      );

      if (result?.success) {
        setMessage({ type: "success", text: result.success });
        // Optimistically update the local state to reflect the change
        const newTimetable = [...timetable];
        const entryIndex = newTimetable.findIndex(
          (e) => e.day === selectedCell.day && e.time === selectedCell.time
        );

        const newEntry = {
          id: new Date().toISOString(), // Use a temp ID for optimistic UI
          day: selectedCell.day,
          time: selectedCell.time,
          subjectId: selectedSubjectId || null,
          teacherId: selectedTeacherId || null,
          subject: subjects.find((s) => s.id === selectedSubjectId) || null,
          teacher: teachers.find((t) => t.id === selectedTeacherId) || null,
        };

        if (entryIndex !== -1) {
          newTimetable[entryIndex] = newEntry;
        } else {
          newTimetable.push(newEntry);
        }
        setTimetable(newTimetable);
        setSelectedCell(null); // Close the edit modal
      } else if (result?.error) {
        setMessage({ type: "error", text: result.error });
      }
    });
  };

  const handleCancel = () => {
    setSelectedCell(null);
  };

  // Create a memoized map for quick lookup
  const timetableMap = useMemo(() => {
    const map = new Map();
    initialTimetable.forEach((entry) => {
      map.set(`${entry.day}-${entry.time}`, entry);
    });
    return map;
  }, [initialTimetable]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-full overflow-x-auto relative">
      {message && (
        <div
          className={`p-3 rounded-md mb-4 ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}
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
                const entry = timetable.find(
                  (e) => e.day === day && e.time === time
                );
                const isBreak = time.includes("BREAK");
                const isSelected =
                  selectedCell?.day === day && selectedCell?.time === time;

                return (
                  <td
                    key={`${day}-${time}`}
                    onClick={() => handleCellClick(day, time)}
                    className={`
                      px-6 py-4 whitespace-nowrap text-sm text-gray-900 border cursor-pointer
                      ${
                        isBreak
                          ? "bg-gray-200 italic text-gray-500"
                          : isSelected
                          ? "bg-indigo-200"
                          : "hover:bg-gray-100"
                      }
                    `}
                  >
                    {isBreak ? (
                      formatTimeSlot(time)
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

      {/* Edit Modal / Form */}
      {selectedCell && !selectedCell.time.includes("BREAK") && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-xl font-bold mb-4">Edit Timetable Entry</h3>
            <div className="space-y-4">
              <p>
                <strong>Day:</strong> {selectedCell.day}
              </p>
              <p>
                <strong>Time:</strong> {formatTimeSlot(selectedCell.time)}
              </p>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subject
                </label>
                <select
                  id="subject"
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">-- Select Subject --</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="teacher"
                  className="block text-sm font-medium text-gray-700"
                >
                  Teacher
                </label>
                <select
                  id="teacher"
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                >
                  <option value="">-- Select Teacher --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
                disabled={isPending}
              >
                {isPending ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
