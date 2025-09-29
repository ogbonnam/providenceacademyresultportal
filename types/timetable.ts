import { DayOfWeek, TimeSlot } from "@prisma/client";

export { DayOfWeek, TimeSlot };

export interface User {
  id: string;
  name: string | null;
}

export interface Subject {
  id: string;
  name: string;
}

export interface TimetableEntry {
  id: string;
  day: DayOfWeek;
  time: TimeSlot;
  subject: Subject | null;
  teacher: User | null;
}

export const days: DayOfWeek[] = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

export const timeSlots: TimeSlot[] = [
  "TIME_08_30_09_30",
  "TIME_09_30_10_30",
  "TIME_10_30_11_00_BREAK",
  "TIME_11_00_12_00",
  "TIME_12_00_13_00",
  "TIME_13_00_14_00_BREAK",
  "TIME_14_00_15_00",
];

/**
 * A helper function to format the time slot enums into a human-readable string.
 * This function is placed here so all components can use it consistently.
 */
export const formatTimeSlot = (slot: TimeSlot) => {
  const formatted = slot.replace(/TIME_/, "").replace(/_/g, " ").trim();
  return formatted.includes("BREAK")
    ? formatted.replace("BREAK", "(Break)")
    : formatted;
};
