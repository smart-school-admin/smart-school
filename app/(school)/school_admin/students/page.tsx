/** next imports */
import Link from "next/link";

/** component imports */
import StudentCard from "../../_components/cards/studentCard";
import { Button } from "@/components/ui/button";

/** icon imports */
import { PlusIcon } from "lucide-react";

export default function StudentsPage() {
  return (
    <div className="w-full min-h-full">
      <h1 className="text-2xl font-semibold mb-8  mt-4 flex justify-between">
        Students
        <Link href="#">
          <Button>
            <PlusIcon /> New Student
          </Button>
        </Link>
      </h1>
      <div className="flex flex-col gap-6">
        {Array(5)
          .fill(0)
          .map((_, index) => (
            <StudentCard key={index} />
          ))}
      </div>
    </div>
  );
}
