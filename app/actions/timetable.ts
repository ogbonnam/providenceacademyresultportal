// app/actions/timetable.ts
"use server";

import { PrismaClient, DayOfWeek, TimeSlot } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

/**
 * Fetches all timetable entries along with their subjects and teachers.
 * This is for admin use and redirects unauthorized users.
 */
export async function getTimetableData() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  try {
    const timetable = await prisma.timetableEntry.findMany({
      include: {
        subject: { select: { id: true, name: true } },
        teacher: { select: { id: true, name: true } },
      },
      orderBy: [{ day: "asc" }, { time: "asc" }],
    });
    return timetable;
  } catch (error) {
    console.error("Error fetching timetable:", error);
    return [];
  }
}

/**
 * Fetches all timetable entries for public/non-admin view.
 */
export async function getPublicTimetableData() {
  try {
    const timetable = await prisma.timetableEntry.findMany({
      include: {
        subject: { select: { id: true, name: true } },
        teacher: { select: { id: true, name: true } },
      },
      orderBy: [{ day: "asc" }, { time: "asc" }],
    });
    return timetable;
  } catch (error) {
    console.error("Error fetching timetable:", error);
    return [];
  }
}

/**
 * Saves a single timetable entry.
 * @param day The day of the week.
 * @param time The time slot.
 * @param subjectId The ID of the subject.
 * @param teacherId The ID of the teacher.
 */
export async function saveTimetableEntry(
  day: DayOfWeek,
  time: TimeSlot,
  subjectId: string | null,
  teacherId: string | null
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "admin") {
    return { error: "Unauthorized." };
  }

  try {
    const updatedEntry = await prisma.timetableEntry.upsert({
      where: { day_time: { day, time } },
      update: {
        subjectId,
        teacherId,
      },
      create: {
        day,
        time,
        subjectId,
        teacherId,
      },
    });

    return { success: "Timetable entry saved successfully." };
  } catch (e: any) {
    console.error("Error saving timetable entry:", e);
    return { error: "Failed to save timetable entry." };
  }
}
