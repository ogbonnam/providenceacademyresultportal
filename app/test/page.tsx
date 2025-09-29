// app/report-card/page.tsx
export default function ReportCard() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div
        className="bg-white shadow-lg"
        style={{
          border: "8px solid #1e40af", // Thick blue border
          borderRadius: "0",
          maxWidth: "800px",
          width: "100%",
        }}
      >
        {/* Top Logo */}
        <div className="flex justify-center pt-6 pb-2">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/1200px-Google_2015_logo.svg.png"
            alt="School Logo"
            style={{
              width: "180px",
              height: "auto",
              marginBottom: "10px",
            }}
          />
        </div>

        {/* Header */}
        <div className="text-center mb-6" style={{ padding: "0 0 10px" }}>
          <h1
            className="text-3xl font-bold"
            style={{
              color: "#1e40af", // Blue text
              marginBottom: "5px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            NOBLE HALL
          </h1>
          <h2
            className="text-xl font-semibold"
            style={{
              color: "#1e40af", // Blue text
              marginBottom: "15px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Leadership Academy for Girls
          </h2>
          <div
            className="py-2 mb-4"
            style={{
              borderTop: "2px solid #1e40af",
              borderBottom: "2px solid #1e40af",
            }}
          >
            <h3
              className="text-lg font-medium"
              style={{
                color: "#000",
                fontFamily: "Arial, sans-serif",
              }}
            >
              SIXTH FORM FOUNDATION 2024/2025 Academic Session
            </h3>
          </div>

          <div
            className="grid grid-cols-3 gap-4 mb-4"
            style={{ padding: "0 20px" }}
          >
            <div className="text-left">
              <p style={{ color: "#000", fontFamily: "Arial, sans-serif" }}>
                <span style={{ fontWeight: "bold" }}>Name:</span> Imran Huda
              </p>
            </div>
            <div className="text-center">
              <p style={{ color: "#000", fontFamily: "Arial, sans-serif" }}>
                <span style={{ fontWeight: "bold" }}>Class:</span> FOUNDATION
              </p>
            </div>
            <div className="text-right">
              <p style={{ color: "#000", fontFamily: "Arial, sans-serif" }}>
                <span style={{ fontWeight: "bold" }}>Number of Subjects:</span>{" "}
                11
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mb-6" style={{ padding: "0 20px" }}>
          <table
            className="min-w-full"
            style={{
              borderCollapse: "collapse",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#e5e7eb" }}>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "8px",
                    textAlign: "left",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  S/N
                </th>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "8px",
                    textAlign: "left",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  SUBJECTS
                </th>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "8px",
                    textAlign: "left",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  EXAM (100)
                </th>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "8px",
                    textAlign: "left",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  GRADE
                </th>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "8px",
                    textAlign: "left",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  ATTENDANCE
                </th>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "8px",
                    textAlign: "left",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  COMMENT
                </th>
                <th
                  style={{
                    border: "1px solid #000",
                    padding: "8px",
                    textAlign: "left",
                    fontSize: "14px",
                    fontWeight: "bold",
                  }}
                >
                  TEACHER
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  sn: 1,
                  subject: "ICT",
                  exam: 42,
                  grade: "A",
                  attendance: "100%",
                  comment: "",
                  teacher: "Odili S.",
                },
                {
                  sn: 2,
                  subject: "SOCIAL STUDIES",
                  exam: 60,
                  grade: "A*",
                  attendance: "100%",
                  comment: "",
                  teacher: "NDUKWE G.",
                },
                {
                  sn: 3,
                  subject: "ART",
                  exam: 39,
                  grade: "B",
                  attendance: "100%",
                  comment: "",
                  teacher: "Eze P.",
                },
                {
                  sn: 4,
                  subject: "FRENCH",
                  exam: 57,
                  grade: "A*",
                  attendance: "100%",
                  comment: "",
                  teacher: "EZE C.",
                },
                {
                  sn: 5,
                  subject: "MATHEMATICS",
                  exam: 54,
                  grade: "A*",
                  attendance: "100%",
                  comment: "",
                  teacher: "EJEBA S.",
                },
                {
                  sn: 6,
                  subject: "ARABIC",
                  exam: 59,
                  grade: "A*",
                  attendance: "100%",
                  comment: "",
                  teacher: "Ishak S.",
                },
                {
                  sn: 7,
                  subject: "IRS",
                  exam: 50,
                  grade: "A*",
                  attendance: "100%",
                  comment: "",
                  teacher: "HALIL M.",
                },
                {
                  sn: 8,
                  subject: "ENGLISH LANGUAGE",
                  exam: 54,
                  grade: "A*",
                  attendance: "100%",
                  comment: "",
                  teacher: "Oluwamuye M.G.",
                },
                {
                  sn: 9,
                  subject: "Science (Biology)",
                  exam: 53,
                  grade: "A*",
                  attendance: "100%",
                  comment: "",
                  teacher: "AGUN J.",
                },
                {
                  sn: 10,
                  subject: "Science (Physics)",
                  exam: 57,
                  grade: "A*",
                  attendance: "100%",
                  comment: "",
                  teacher: "EJEBA S.",
                },
                {
                  sn: 11,
                  subject: "Science (Chemistry)",
                  exam: 57,
                  grade: "A*",
                  attendance: "100%",
                  comment: "",
                  teacher: "OMONIYI J.",
                },
              ].map((row) => (
                <tr
                  key={row.sn}
                  style={{
                    backgroundColor: row.sn % 2 === 0 ? "#f3f4f6" : "#ffffff",
                  }}
                >
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      fontSize: "14px",
                    }}
                  >
                    {row.sn}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      fontSize: "14px",
                    }}
                  >
                    {row.subject}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      fontSize: "14px",
                    }}
                  >
                    {row.exam}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      fontSize: "14px",
                      fontWeight: "bold",
                    }}
                  >
                    {row.grade}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      fontSize: "14px",
                    }}
                  >
                    {row.attendance}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      fontSize: "14px",
                    }}
                  >
                    {row.comment}
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      fontSize: "14px",
                    }}
                  >
                    {row.teacher}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Average */}
        <div className="text-right mb-6" style={{ padding: "0 20px" }}>
          <p
            className="text-lg font-semibold"
            style={{
              color: "#000",
              fontFamily: "Arial, sans-serif",
            }}
          >
            PERCENTAGE AVERAGE: <span style={{ color: "#1e40af" }}>91.73%</span>
          </p>
        </div>

        {/* Comments Section */}
        <div className="mb-6" style={{ padding: "0 20px" }}>
          <h3
            className="text-lg font-semibold mb-2"
            style={{
              color: "#000",
              borderBottom: "1px solid #000",
              paddingBottom: "5px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Form Tutor's Comment:
          </h3>
          <p
            className="mb-4"
            style={{
              color: "#000",
              fontFamily: "Arial, sans-serif",
              minHeight: "24px",
            }}
          >
            It’s been an amazing half term with you. Keep striving!
          </p>

          <h3
            className="text-lg font-semibold mb-2"
            style={{
              color: "#000",
              borderBottom: "1px solid #000",
              paddingBottom: "5px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            Principal's Comment:
          </h3>
          <p
            className="mb-4"
            style={{
              color: "#000",
              fontFamily: "Arial, sans-serif",
              minHeight: "24px",
            }}
          >
            {/* Empty comment */}
          </p>
        </div>

        {/* Footer with Signatures */}
        <div
          className="flex justify-between mb-6"
          style={{
            padding: "0 20px",
            fontFamily: "Arial, sans-serif",
          }}
        >
          <div>
            <p style={{ color: "#000", fontWeight: "bold" }}>Mr Ashish Gill</p>
            <p style={{ color: "#000", fontSize: "14px" }}>(Principal)</p>
          </div>
          <div className="text-right">
            <p style={{ color: "#000", fontWeight: "bold" }}>GRACE NDUKWE</p>
            <p style={{ color: "#000", fontSize: "14px" }}>(Form Tutor)</p>
          </div>
        </div>

        {/* Full-width Footer Image */}
        <div style={{ width: "100%", overflow: "hidden" }}>
          <img
            src="https://images.unsplash.com/photo-1501854140801-50d01698950b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
            alt="School Campus"
            style={{
              width: "100%",
              height: "120px",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      </div>
    </div>
  );
}
