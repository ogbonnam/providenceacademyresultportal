"use client";

import { useEffect, useState } from "react";
import {
  getSubmittedReports,
  approveReports,
  rejectReports,
} from "@/app/actions/reports";
import { useSession } from "next-auth/react";
import AdminLayout from "@/components/dashboard/AdminLayout";

export default function ApproveReportsContent() {
  const { data: session } = useSession();
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      const res = await getSubmittedReports();
      setGroups(res);
      setLoading(false);
    }
    fetchReports();
  }, []);

  async function handleApprove(scoreIds: string[]) {
    if (!session?.user) return;
    setActionLoading(true);

    try {
      await approveReports(scoreIds);
      setGroups((prev) =>
        prev.filter((g) => !g.scores.some((s: any) => scoreIds.includes(s.id)))
      );
    } catch (error) {
      console.error("Error approving scores:", error);
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject(scoreIds: string[]) {
    setActionLoading(true);

    try {
      await rejectReports(scoreIds);
      setGroups((prev) =>
        prev.filter((g) => !g.scores.some((s: any) => scoreIds.includes(s.id)))
      );
    } catch (error) {
      console.error("Error rejecting scores:", error);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Approve Reports</h1>

        {groups.length === 0 && <p>No reports submitted for approval.</p>}

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
                    <td className="p-2 border">{s.comment ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  handleApprove(group.scores.map((s: any) => s.id))
                }
                disabled={actionLoading}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(group.scores.map((s: any) => s.id))}
                disabled={actionLoading}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
