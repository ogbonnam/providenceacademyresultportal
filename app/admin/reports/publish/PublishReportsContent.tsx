"use client";

import { useEffect, useState } from "react";
import { getApprovedReports, unpublishReports } from "@/app/actions/reports";
import AdminLayout from "@/components/dashboard/AdminLayout";

export default function PublishReportsContent() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getApprovedReports().then((res) => {
      setGroups(res);
      setLoading(false);
    });
  }, []);

  async function handleUnpublish(scoreIds: string[]) {
    await unpublishReports(scoreIds);
    setGroups(
      groups.filter((g) => !g.scores.some((s: any) => scoreIds.includes(s.id)))
    );
  }

  if (loading) return <p>Loading...</p>;

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Published Reports</h1>

        {groups.length === 0 && <p>No published reports found.</p>}

        {groups.map((group, idx) => (
          <div key={idx} className="border p-4 rounded-lg mb-6 shadow-sm">
            <h2 className="font-semibold text-lg mb-2">
              {group.subjectName} — Teacher: {group.teacherName}
            </h2>

            <table className="w-full border mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Student</th>
                  <th className="p-2 border">Score1</th>
                  <th className="p-2 border">Score2</th>
                  <th className="p-2 border">Exam</th>
                  <th className="p-2 border">Total</th>
                  <th className="p-2 border">Attendance</th>
                  <th className="p-2 border">Comment</th>
                </tr>
              </thead>
              <tbody>
                {group.scores.map((s: any) => (
                  <tr key={s.id}>
                    <td className="p-2 border">
                      {s.studentSubject.student.name}
                    </td>
                    <td className="p-2 border">{s.score1}</td>
                    <td className="p-2 border">{s.score2}</td>
                    <td className="p-2 border">{s.exam}</td>
                    <td className="p-2 border">{s.total}</td>
                    <td className="p-2 border">{s.attendance}</td>
                    <td className="p-2 border">{s.comment}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  handleUnpublish(group.scores.map((s: any) => s.id))
                }
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
              >
                Unpublish
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
