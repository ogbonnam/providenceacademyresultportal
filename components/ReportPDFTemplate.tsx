import React from "react";

interface ReportData {
  schoolName: string;
  schoolLogoUrl: string;
  studentName: string;
  studentId: string;
  className: string;
  term: string;
  academicYear: string;
  reports: {
    subject: string;
    test1: number;
    test2: number;
    exam: number;
    total: number;
    comment?: string;
  }[];
  attendance: string;
  conduct: string;
  interest: string;
  formMasterComment: string;
  principalComment: string;
  termAverage?: string; // add this line
}

const ReportPDFTemplate: React.FC<ReportData> = ({
  schoolName,
  schoolLogoUrl,
  studentName,
  studentId,
  className,
  term,
  academicYear,
  reports,
  attendance,
  conduct,
  interest,
  formMasterComment,
  principalComment,
}) => {
  // Calculate term average
  const termAverage =
    reports.length > 0
      ? (reports.reduce((sum, r) => sum + r.total, 0) / reports.length).toFixed(
          2
        )
      : "0.00";

  return (
    <div
      style={{
        fontFamily: "'Times New Roman', Times, serif",
        padding: "20px",
        maxWidth: "900px",
        margin: "0 auto",
        fontSize: "14px",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <img
          src={schoolLogoUrl}
          alt="School Logo"
          style={{ width: "90px", height: "90px" }}
        />
        <h1 style={{ margin: "5px 0", fontSize: "22px" }}>{schoolName}</h1>
        <p style={{ margin: 0, fontWeight: "bold" }}>ACADEMIC REPORT CARD</p>
      </div>

      {/* Student Info */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "15px",
        }}
      >
        <tbody>
          <tr>
            <td>
              <strong>Name:</strong> {studentName}
            </td>
            <td>
              <strong>Student ID:</strong> {studentId}
            </td>
          </tr>
          <tr>
            <td>
              <strong>Class:</strong> {className}
            </td>
            <td>
              <strong>Term:</strong> {term}
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <strong>Academic Year:</strong> {academicYear}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Results Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "15px",
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>Subject</th>
            <th style={thStyle}>Test 1</th>
            <th style={thStyle}>Test 2</th>
            <th style={thStyle}>Exam</th>
            <th style={thStyle}>Total</th>
            <th style={thStyle}>Comment</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r, i) => (
            <tr key={i}>
              <td style={tdStyle}>{r.subject}</td>
              <td style={tdStyle}>{r.test1}</td>
              <td style={tdStyle}>{r.test2}</td>
              <td style={tdStyle}>{r.exam}</td>
              <td style={tdStyle}>
                <strong>{r.total}</strong>
              </td>
              <td style={tdStyle}>{r.comment || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Term Average */}
      <p>
        <strong>Term Average:</strong> {termAverage}%
      </p>

      {/* Behaviour Section */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "15px",
          marginBottom: "15px",
        }}
      >
        <tbody>
          <tr>
            <td style={tdStyle}>
              <strong>Attendance:</strong> {attendance}
            </td>
            <td style={tdStyle}>
              <strong>Conduct:</strong> {conduct}
            </td>
            <td style={tdStyle}>
              <strong>Interest:</strong> {interest}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Comments Section */}
      <div style={{ marginTop: "15px" }}>
        <p>
          <strong>Form Master's Comment:</strong>
        </p>
        <p style={commentBox}>{formMasterComment}</p>

        <p>
          <strong>Principal's Comment:</strong>
        </p>
        <p style={commentBox}>{principalComment}</p>
      </div>
    </div>
  );
};

const thStyle: React.CSSProperties = {
  border: "1px solid #000",
  padding: "5px",
  backgroundColor: "#f0f0f0",
  textAlign: "center",
};

const tdStyle: React.CSSProperties = {
  border: "1px solid #000",
  padding: "5px",
  textAlign: "center",
};

const commentBox: React.CSSProperties = {
  border: "1px solid #000",
  padding: "8px",
  minHeight: "40px",
};

export default ReportPDFTemplate;
