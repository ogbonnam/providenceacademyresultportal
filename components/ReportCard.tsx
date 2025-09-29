"use client";

import React, { useRef } from "react";

interface Report {
  subject: string;
  test1: number;
  test2: number;
  exam: number;
  total: number;
  teacher: string;
  comment: string;
}

interface Props {
  studentName: string;
  studentId: string;
  reports: Report[];
  blocked?: boolean;
}

const ReportCard: React.FC<Props> = ({
  studentName,
  studentId,
  reports,
  blocked,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const downloadReport = async () => {
    if (!reportRef.current) return;

    // ✅ dynamically import on client only
    const html2pdf = (await import("html2pdf.js")).default;

    html2pdf()
      .set({
        margin: 10,
        filename: `${studentName}-report.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(reportRef.current)
      .save();
  };

  // If student is blocked, show nothing
  if (blocked)
    return (
      <p className="text-red-600 mt-4">You cannot download your report.</p>
    );

  const average =
    reports.length > 0
      ? reports.reduce((sum, r) => sum + r.total, 0) / reports.length
      : 0;

  return (
    <div className="mt-4">
      <div ref={reportRef} className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Report Card</h2>
        <p>
          <strong>Name:</strong> {studentName}
        </p>
        <p>
          <strong>Student ID:</strong> {studentId}
        </p>

        <table className="w-full mt-4 border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-400 px-2 py-1">Subject</th>
              <th className="border border-gray-400 px-2 py-1">Test 1</th>
              <th className="border border-gray-400 px-2 py-1">Test 2</th>
              <th className="border border-gray-400 px-2 py-1">Exam</th>
              <th className="border border-gray-400 px-2 py-1">Total</th>
              <th className="border border-gray-400 px-2 py-1">Teacher</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r, idx) => (
              <tr key={idx} className="text-center">
                <td className="border border-gray-400 px-2 py-1">
                  {r.subject}
                </td>
                <td className="border border-gray-400 px-2 py-1">{r.test1}</td>
                <td className="border border-gray-400 px-2 py-1">{r.test2}</td>
                <td className="border border-gray-400 px-2 py-1">{r.exam}</td>
                <td className="border border-gray-400 px-2 py-1">{r.total}</td>
                <td className="border border-gray-400 px-2 py-1">
                  {r.teacher}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-2">
          <strong>Average:</strong> {average.toFixed(2)}
        </p>

        <div className="mt-4">
          {reports.map((r, idx) => (
            <div key={idx} className="mb-2">
              <strong>{r.subject}:</strong> {r.comment || "No comment"}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <p>
            <strong>Principal Signature:</strong> ______________________
          </p>
        </div>
      </div>

      <button
        onClick={downloadReport}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Download Report
      </button>
    </div>
  );
};

export default ReportCard;
