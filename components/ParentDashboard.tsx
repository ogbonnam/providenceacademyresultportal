"use client";
import React, { useState, useEffect, useRef } from "react";
import { getLinkedStudents } from "@/app/actions/parent";
import { StudentReport, StudentProfile } from "../types/app";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ReportPDFTemplate from "@/components/ReportPDFTemplate";

interface LinkedStudent {
  id: string;
  name: string;
  reports: StudentReport[];
  profile: StudentProfile;
}

const ParentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"yourWard" | "reports">(
    "yourWard"
  );
  const [linkedStudents, setLinkedStudents] = useState<LinkedStudent[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  const pdfRef = useRef<HTMLDivElement>(null);
  const html2pdfRef = useRef<any>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const studentsFromApi = await getLinkedStudents();

        const mappedStudents: LinkedStudent[] = studentsFromApi.map(
          (s: any, idx: number) => ({
            id: String(s.id ?? `student-${idx}`),
            name: s.name ?? "Unnamed Student",
            reports: (s.reports ?? []).map((r: any, rIdx: number) => ({
              ...r,
              id: r.id != null && !isNaN(Number(r.id)) ? Number(r.id) : rIdx,
            })),
            profile: s.profile,
          })
        );

        setLinkedStudents(mappedStudents);

        if (mappedStudents.length > 0) {
          setSelectedStudentId(mappedStudents[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  // Dynamically import html2pdf.js on client once when component mounts
  useEffect(() => {
    import("html2pdf.js").then((module) => {
      html2pdfRef.current = module.default;
    });
  }, []);

  const selectedStudent = linkedStudents.find(
    (student) => student.id === selectedStudentId
  );

  const handleDownloadPdf = () => {
    if (!pdfRef.current || !selectedStudent || !html2pdfRef.current) return;

    html2pdfRef
      .current()
      .from(pdfRef.current)
      .set({
        margin: 0.5,
        filename: `${selectedStudent.name}-report.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .save();
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg min-h-[500px] w-full max-w-4xl mx-auto my-8 font-sans">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">
        Parent Dashboard
      </h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-3 px-6 text-lg font-medium ${
            activeTab === "yourWard"
              ? "border-b-4 border-indigo-600 text-indigo-700"
              : "text-gray-600 hover:text-indigo-600"
          }`}
          onClick={() => setActiveTab("yourWard")}
        >
          Your Ward's Profiles
        </button>
        <button
          className={`py-3 px-6 text-lg font-medium ${
            activeTab === "reports"
              ? "border-b-4 border-indigo-600 text-indigo-700"
              : "text-gray-600 hover:text-indigo-600"
          }`}
          onClick={() => setActiveTab("reports")}
        >
          Reports
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
        </div>
      ) : (
        <div>
          {activeTab === "yourWard" && (
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Student Profiles
              </h3>
              {linkedStudents.length > 0 ? (
                linkedStudents.map((student) => (
                  <div
                    key={student.id}
                    className="mb-8 p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                  >
                    <h4 className="text-xl font-semibold text-indigo-800 mb-4">
                      {student.name}'s Profile
                    </h4>
                    {student.profile ? (
                      <div>
                        <p className="text-lg mb-2">
                          <span className="font-semibold text-gray-700">
                            Student Name:
                          </span>{" "}
                          {student.profile.name}
                        </p>
                        <p className="text-lg mb-2">
                          <span className="font-semibold text-gray-700">
                            Email:
                          </span>{" "}
                          {student.profile.email}
                        </p>
                        <p className="text-lg mb-2">
                          <span className="font-semibold text-gray-700">
                            Foundation Year:
                          </span>{" "}
                          {student.profile.foundationYear}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-600">
                        Profile information not available for {student.name}.
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-600">
                  No students linked to this parent account.
                </p>
              )}
            </div>
          )}

          {activeTab === "reports" && (
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Student Reports
              </h3>
              {linkedStudents.length > 0 ? (
                <>
                  <div className="mb-6">
                    <label
                      htmlFor="student-select"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Select a student:
                    </label>
                    <select
                      id="student-select"
                      value={selectedStudentId || ""}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
                    >
                      {linkedStudents.map((student) => (
                        <option key={student.id} value={student.id}>
                          {student.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedStudent && (
                    <>
                      {/* Download Button */}
                      <button
                        onClick={handleDownloadPdf}
                        className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      >
                        Download PDF
                      </button>

                      <h4 className="text-xl font-semibold text-indigo-800 mb-4">
                        {selectedStudent.name}'s Performance Chart
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-lg shadow-sm mb-8 h-80 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={selectedStudent.reports}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="subject" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="total"
                              stroke="#8884d8"
                              activeDot={{ r: 8 }}
                              name="Total Score"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      <h4 className="text-xl font-semibold text-indigo-800 mb-4">
                        {selectedStudent.name}'s Reports
                      </h4>
                      {selectedStudent.reports.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full bg-white border border-gray-200 rounded-lg mb-8">
                            <thead>
                              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Term</th>
                                <th className="py-3 px-6 text-left">Subject</th>
                                <th className="py-3 px-6 text-left">Test 1</th>
                                <th className="py-3 px-6 text-left">Test 2</th>
                                <th className="py-3 px-6 text-left">Exam</th>
                                <th className="py-3 px-6 text-left">Total</th>
                                <th className="py-3 px-6 text-left">Comment</th>
                              </tr>
                            </thead>
                            <tbody className="text-gray-700 text-sm">
                              {selectedStudent.reports.map((report, rIdx) => (
                                <tr
                                  key={report.id ?? rIdx}
                                  className="border-b border-gray-200 hover:bg-gray-50"
                                >
                                  <td className="py-3 px-6">{report.term}</td>
                                  <td className="py-3 px-6">
                                    {report.subject}
                                  </td>
                                  <td className="py-3 px-6">{report.test1}</td>
                                  <td className="py-3 px-6">{report.test2}</td>
                                  <td className="py-3 px-6">{report.exam}</td>
                                  <td className="py-3 px-6 font-bold">
                                    {report.total}
                                  </td>
                                  <td className="py-3 px-6">
                                    {report.comment}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="text-gray-600">
                          No reports available for {selectedStudent.name} yet.
                        </p>
                      )}

                      {/* Hidden PDF template */}
                      <div style={{ display: "none" }}>
                        <div ref={pdfRef}>
                          <ReportPDFTemplate
                            schoolName="Springfield High School"
                            schoolLogoUrl="/school-logo.png"
                            studentName={selectedStudent.name}
                            studentId={selectedStudent.id}
                            className={String(
                              selectedStudent.profile.foundationYear || "N/A"
                            )}
                            term={selectedStudent.reports[0]?.term || ""}
                            academicYear="2024/2025"
                            reports={selectedStudent.reports.map((r) => ({
                              subject: r.subject,
                              test1: r.test1,
                              test2: r.test2,
                              exam: r.exam,
                              total: r.total,
                              comment: r.comment,
                            }))}
                            termAverage={
                              selectedStudent.reports.length > 0
                                ? (
                                    selectedStudent.reports.reduce(
                                      (sum, r) => sum + Number(r.total || 0),
                                      0
                                    ) / selectedStudent.reports.length
                                  ).toFixed(2) + "%"
                                : "N/A"
                            }
                            attendance="95%"
                            conduct="Excellent"
                            interest="High"
                            formMasterComment="Shows great enthusiasm in learning."
                            principalComment="Keep up the excellent performance."
                          />
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <p className="text-gray-600">
                  No students linked to this parent account.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ParentDashboard;
