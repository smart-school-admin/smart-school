/** next imports */
import Link from "next/link";

/** component imports */
import StudentCard from "@/app/(school)/_components/cards/studentCard";
import { Button } from "@/components/ui/button";

/** functions */
import { getAllStudents } from "../../_actions/student";

/** icon imports */
import { PlusIcon } from "lucide-react";

export default async function StudentsPage() {
  const students = await getAllStudents();
  return (
    <div className="w-full min-h-full">
      <h1 className="text-2xl font-semibold mb-8  mt-4 flex justify-between">
        Students
        <Link href="/school_admin/add/student">
          <Button>
            <PlusIcon /> New Student
          </Button>
        </Link>
      </h1>
      {!students ||
        (students.length < 0 && (
          <div className="text-center">No students found</div>
        ))}
      {students && students.length > 0 && (
        <div className="flex flex-col gap-6">
          {students.map((student, index) => (
            <StudentCard
              key={index}
              firstName={student.first_name}
              lastName={student.last_name}
              otherNames={student.other_names}
              course={`${student.course.code}-${student.course.name}`}
              image={student.imagePath??undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
