/** components */
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import TeacherCard from "@/app/(school)/_components/cards/teacherCard";

const teachers = []

export default function TeachersPage() {
  return (
    <div className="w-full min-h-full">
      <h1 className="text-2xl font-semibold mb-8  mt-4 flex justify-between">
        Teachers
        <Link href="/school_admin/add/teacher">
          <Button>
            <PlusIcon /> New Teacher
          </Button>
        </Link>
      </h1>
      <div className="flex flex-col gap-6">
        {Array(5).fill(0).map((item, index) => <TeacherCard key={index}/>)}
      </div>
      {/* {teachers && teachers.length > 0 && (
        <div className="flex flex-col gap-6">
          {teachers.map((teacher, index) => (
            <TeacherCard
              key={index}
              firstName={student.first_name}
              lastName={student.last_name}
              otherNames={student.other_names}
              course={`${student.course.code}-${student.course.name}`}
              image={student.imagePath ?? undefined}
            />
          ))}
        </div>
      )} */}
    </div>
  );
}
