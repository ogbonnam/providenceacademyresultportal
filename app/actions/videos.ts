// app/actions/videos.ts
"use server";

import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

/**
 * Fetches all available subjects from the database.
 */
export async function getSubjects() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/signin");
  }

  try {
    const subjects = await prisma.subject.findMany({
      orderBy: { name: "asc" },
    });
    return subjects;
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return [];
  }
}

/**
 * Fetches all educational videos for a given subject.
 * @param subjectId The ID of the subject to filter videos by.
 */
export async function getVideosBySubjectId(subjectId: string) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return [];
  }

  try {
    const videos = await prisma.educationalVideo.findMany({
      where: { subjectId },
      include: {
        uploader: { select: { name: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return videos;
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}

/**
 * Adds a new educational video to the database.
 * This action is restricted to admins and teachers.
 * @param title The title of the video.
 * @param youtubeUrl The YouTube embed URL.
 * @param subjectId The ID of the subject the video belongs to.
 */
export async function addEducationalVideo(
  title: string,
  youtubeUrl: string,
  subjectId: string
) {
  const session = await getServerSession(authOptions);

  // Authorization check
  if (
    !session ||
    (session.user.role !== "admin" && session.user.role !== "teacher")
  ) {
    return { error: "Unauthorized access." };
  }

  // This is a basic validation for a YouTube video URL
  if (!youtubeUrl.includes("youtube.com/embed/")) {
    return { error: "Invalid YouTube embed URL." };
  }

  try {
    const newVideo = await prisma.educationalVideo.create({
      data: {
        title,
        youtubeUrl,
        subjectId,
        uploaderId: session.user.id,
      },
    });

    return { success: true, video: newVideo };
  } catch (error) {
    console.error("Error adding educational video:", error);
    return { error: "Failed to add video." };
  }
}
