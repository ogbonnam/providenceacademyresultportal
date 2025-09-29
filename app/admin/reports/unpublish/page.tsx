import AdminLayout from "@/components/dashboard/AdminLayout";
import UnpublishStudentScores from "./UnpublishStudentScores";
import { prisma } from "@/lib/prisma";

interface Student {
  id: string;
  name: string | null;
  email: string;
}

// Server-side function
async function getStudentsWithScores(): Promise<Student[]> {
  return prisma.user.findMany({
    where: {
      role: "student",
      subjectsTaking: {
        some: {
          scores: {
            some: {},
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}

export default async function UnpublishPage() {
  const students = await getStudentsWithScores();

  return (
    <AdminLayout>
      <div className="p-6 text-black">
        <h1 className="text-2xl font-bold mb-6">
          Unpublish / Block Student Scores
        </h1>

        {students.length === 0 && <p>No students with scores found.</p>}

        {students.map((student) => (
          <UnpublishStudentScores key={student.id} student={student} />
        ))}
      </div>
    </AdminLayout>
  );
}
