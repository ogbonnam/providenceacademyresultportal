"use client";

import React from "react";
import html2pdf from "html2pdf.js";

interface Props {
  studentName: string;
  studentId: string;
  reports: any[];
}

export default function DownloadReportButton({
  studentName,
  studentId,
  reports,
}: Props) {
  const downloadReport = () => {
    const element = document.getElementById("report-card");
    if (!element) return;

    html2pdf()
      .set({
        margin: 10,
        filename: "report.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save();
  };

  return (
    <button
      onClick={downloadReport}
      className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mt-4"
    >
      Download Report
    </button>
  );
}
