// app/actions/dashboard.ts
"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

/**
 * Fetches the summary counts for students, teachers, and subjects.
 */
export async function getDashboardSummary() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/signin");
  }

  try {
    const [students, teachers, subjects] = await prisma.$transaction([
      prisma.user.count({ where: { role: "student", status: "active" } }),
      prisma.user.count({ where: { role: "teacher", status: "active" } }),
      prisma.subject.count(),
    ]);

    return { students, teachers, subjects };
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    return { students: 0, teachers: 0, subjects: 0 };
  }
}

/**
 * Fetches all upcoming events.
 */
export async function getUpcomingEvents() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/signin");
  }

  try {
    const events = await prisma.event.findMany({
      where: {
        date: {
          gte: new Date(),
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

/**
 * Fetches all students and calculates their average score across all subjects.
 * Scores are sorted from highest to lowest.
 */
export async function getStudentsPerformance() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/signin");
  }

  try {
    const students = await prisma.user.findMany({
      where: {
        role: "student",
        status: "active",
      },
      select: {
        id: true,
        name: true,
        subjectsTaking: {
          select: {
            scores: {
              select: {
                total: true,
              },
            },
          },
        },
      },
    });

    const studentsWithAverage = students.map((student) => {
      let totalScores = 0;
      let subjectCount = 0;

      student.subjectsTaking.forEach((subject) => {
        // Only count subjects that have a score entry
        if (subject.scores.length > 0) {
          subject.scores.forEach((score) => {
            totalScores += score.total;
            subjectCount += 1;
          });
        }
      });

      const averageScore = subjectCount > 0 ? totalScores / subjectCount : 0;

      return {
        id: student.id,
        name: student.name,
        averageScore: parseFloat(averageScore.toFixed(2)),
      };
    });

    // Sort students by average score, highest to lowest
    studentsWithAverage.sort((a, b) => b.averageScore - a.averageScore);

    return studentsWithAverage;
  } catch (error) {
    console.error("Error fetching student performance:", error);
    return [];
  }
}
