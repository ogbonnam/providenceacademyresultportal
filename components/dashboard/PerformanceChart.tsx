// components/dashboard/PerformanceChart.tsx
"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface StudentPerformanceData {
  id: string;
  name: string | null;
  averageScore: number;
}

interface PerformanceChartProps {
  data: StudentPerformanceData[];
}

/**
 * A bar chart displaying students' average performance scores.
 * @param data An array of student performance data.
 */
export default function PerformanceChart({ data }: PerformanceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 w-full h-96 flex items-center justify-center">
        <p className="text-gray-500 text-center">
          No student performance data available. Please ensure students have
          scores assigned in the database.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full h-96">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Student Performance Overview (Average Score)
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="averageScore" name="Average Score" fill="#4f46e5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
