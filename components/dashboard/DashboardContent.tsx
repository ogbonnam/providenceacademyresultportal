"use client";

import React from "react";
import SummaryCards from "./SummaryCards";
import PerformanceChart from "./PerformanceChart";
import CalendarCard from "./CalendarCard";
import EventsCard from "./EventsCard";
import FullTimetableCard from "./FullTimetableCard";
import { format } from "date-fns";
// Import necessary types from the central file
import { TimetableEntry } from "@/types/timetable";

interface User {
  id: string;
  name: string | null;
}

interface Subject {
  id: string;
  name: string;
}

interface DashboardContentProps {
  summary?: {
    students: number;
    teachers: number;
    subjects: number;
  };
  // The interface for the performance data has been updated back to averageScore
  performance?: { id: string; name: string | null; averageScore: number }[];
  events?: { id: string; title: string; date: Date }[];
  timetable?: TimetableEntry[];
}

export default function DashboardContent({
  summary,
  performance,
  events,
  timetable,
}: DashboardContentProps) {
  // Use a default empty array if events is undefined to prevent the crash
  const formattedEvents = (events || []).map((event) => ({
    title: event.title,
    date: format(event.date, "MMM dd, yyyy"),
  }));

  // Add default values for props that might be undefined
  const safeSummary = summary || { students: 0, teachers: 0, subjects: 0 };
  const safePerformance = performance || [];
  const safeTimetable = timetable || [];

  return (
    <div className="space-y-6">
      <SummaryCards
        students={safeSummary.students}
        teachers={safeSummary.teachers}
        subjects={safeSummary.subjects}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2">
          <PerformanceChart data={safePerformance} />
        </div>
        <div className="col-span-1 flex flex-col space-y-6">
          <CalendarCard />
          <EventsCard events={formattedEvents} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="col-span-1">
          <FullTimetableCard timetable={safeTimetable} />
        </div>
      </div>
    </div>
  );
}
