"use client";

import React from "react";

interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  designation: string;
  address: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  subjectsTaught: string[];
  role: string;
  bio?: string; // made optional since Prisma doesn't have it
}

export default function SingleTeacherProfile({
  teacher,
}: {
  teacher: TeacherProfile | null;
}) {
  if (!teacher) return <p>Teacher not found or unauthorized.</p>;

  return (
    <div>
      <h1>{teacher.name}</h1>
      <p>Email: {teacher.email}</p>
      <p>Designation: {teacher.designation}</p>
      <p>Address: {teacher.address}</p>
      <p>Phone: {teacher.phone}</p>
      <p>Gender: {teacher.gender}</p>
      <p>Date of Birth: {teacher.dateOfBirth}</p>
      <p>Subjects: {teacher.subjectsTaught.join(", ")}</p>
      {teacher.bio && <p>Bio: {teacher.bio}</p>}
    </div>
  );
}
