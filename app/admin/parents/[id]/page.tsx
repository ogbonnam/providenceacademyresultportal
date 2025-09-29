// app/admin/parents/[id]/page.tsx
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

export default async function ParentDetailsPage({ params }: Params) {
  const { id } = params;
  const result = await getUserDetails(id);

  if (result.error || !result.user || result.user.role !== "parent") {
    return notFound();
  }

  const parent = result.user;

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <Image
              src={
                parent.image ||
                "https://placehold.co/100x100/E5E7EB/4B5563?text=P"
              }
              alt={parent.name || "Parent Photo"}
              width={100}
              height={100}
              className="rounded-full shadow-md object-cover mr-6"
            />
            <div>
              <h1 className="text-4xl font-extrabold text-indigo-700">
                {parent.name}
              </h1>
              <p className="text-lg text-gray-600">Parent Details</p>
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full mt-2 ${
                  parent.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {parent.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg text-gray-800">
            <p>
              <strong>Email:</strong> {parent.email}
            </p>
            <p>
              <strong>Phone:</strong> {parent.phone}
            </p>
            <p>
              <strong>Occupation:</strong> {parent.occupation}
            </p>
            <div className="md:col-span-2">
              <p>
                <strong>Address:</strong> {parent.address}
              </p>
            </div>
            <div className="md:col-span-2 mt-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Students
              </h3>
              {parent.students.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-base">
                  {parent.students.map((student) => (
                    <li key={student.id}>
                      <Link
                        href={`/admin/students/${student.id}`}
                        className="text-indigo-600 hover:underline"
                      >
                        {student.name} ({student.email})
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-base">
                  No students linked to this parent.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
