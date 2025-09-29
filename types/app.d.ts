// types/app.d.ts
// This file defines common interfaces used across the application.

// Define the possible user roles
export type UserRole = "guest" | "student" | "teacher" | "parent" | "admin";

// Interface for Student Report data
export interface StudentReport {
  id: number;
  term: string;
  subject: string;
  test1: number;
  test2: number;
  exam: number;
  total: number;
  comment: string;
}

// Interface for Student Profile data
export interface StudentProfile {
  name: string;
  studentId: string;
  email: string;
  foundationYear: string;
}

// Interface for Learning Resource data
export interface LearningResource {
  id: number;
  title: string;
  type: "video" | "document";
  link: string;
}

// Interface for Student data (used in TeacherDashboard)
export interface Student {
  id: string;
  name: string;
}

// Interface for Subject data (used in TeacherDashboard)
export interface Subject {
  id: string;
  name: string;
}

// Interface for a single student's score entry (used in TeacherDashboard)
export interface StudentScoreEntry {
  test1: number | ""; // Allow empty string for initial state
  test2: number | "";
  exam: number | "";
  comment: string;
  total: number;
}

// Interface for the collection of student scores by ID (used in TeacherDashboard)
export interface StudentScores {
  [studentId: string]: StudentScoreEntry;
}
