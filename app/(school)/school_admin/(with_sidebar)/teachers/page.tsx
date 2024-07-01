/** components */
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import TeacherCard from "@/app/(school)/_components/cards/teacherCard";

/**server functions */
import { getTeachers } from "../../_actions/teachers";

export default async function TeachersPage() {
  const response = await getTeachers();
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
      {/* <div className="flex flex-col gap-6">
        {Array(5)
          .fill(0)
          .map((item, index) => (
            <TeacherCard key={index} />
          ))}
      </div> */}
      {response.data && response.data.length > 0 && (
        <div className="flex flex-col gap-6">
          {response.data.map(
            (
              teacher,
              index: number
            ) => (
              <TeacherCard
                key={index}
                firstName={teacher.first_name}
                lastName={teacher.last_name}
                otherNames={teacher.other_names}
                subject={teacher.subject.name}
                image={teacher.imagePath ?? undefined}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}
