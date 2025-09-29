// app/admin/students/[id]/page.tsx
import AdminLayout from "@/components/dashboard/AdminLayout";
import { getUserDetails } from "@/app/actions/user";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = {
  params: {
    id: string;
  };
};

export default async function StudentDetailsPage({ params }: Params){
  const { id } = params;
  const result = await getUserDetails(id);

  if (result.error || !result.user || result.user.role !== "student") {
    return notFound();
  }

  const student = result.user;

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Image
              src={
                student.photoUrl ||
                "https://placehold.co/100x100/E5E7EB/4B5563?text=S"
              }
              alt={student.name || "Student Photo"}
              width={100}
              height={100}
              className="rounded-full shadow-md object-cover mr-6"
            />
            <div>
              <h1 className="text-4xl font-extrabold text-indigo-700">
                {student.name}
              </h1>
              <p className="text-lg text-gray-600">Student Details</p>
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mt-2 ${
                  student.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {student.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg text-gray-800">
            <p>
              <strong>Email:</strong> {student.email}
            </p>
            <p>
              <strong>Parent:</strong>{" "}
              {student.parent?.name ? (
                <Link
                  href={`/admin/parents/${student.parentId}`}
                  className="text-indigo-600 hover:underline"
                >
                  {student.parent.name}
                </Link>
              ) : (
                "N/A"
              )}
            </p>
            <p>
              <strong>Phone:</strong> {student.phone || "N/A"}
            </p>
            <p>
              <strong>Date of Birth:</strong>{" "}
              {student.dateOfBirth?.toDateString() || "N/A"}
            </p>
            <p>
              <strong>Nationality:</strong> {student.nationality}
            </p>
            <p>
              <strong>State:</strong> {student.state}
            </p>
            <p>
              <strong>Boarding Status:</strong> {student.boardingStatus}
            </p>
            <p>
              <strong>Level:</strong> {student.level}
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
