"use client";

import { useState } from "react";
import { unpublishStudentScores } from "@/app/actions/reports";

interface Props {
  student: {
    id: string;
    name: string | null;
    email: string;
  };
}

export default function UnpublishStudentScores({ student }: Props) {
  const [blocked, setBlocked] = useState(false);

  async function handleToggle() {
    await unpublishStudentScores(student.id);
    setBlocked(!blocked);
  }

  return (
    <div className="flex justify-between items-center border p-3 rounded mb-2">
      <div>
        {student.name} ({student.email})
      </div>
      <button
        className={`px-4 py-2 rounded ${
          blocked ? "bg-green-600" : "bg-red-600"
        } text-white`}
        onClick={handleToggle}
      >
        {blocked ? "Unblock" : "Block"}
      </button>
    </div>
  );
}
