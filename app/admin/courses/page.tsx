/** component imports */
import { Button } from "@/components/ui/button";
import SSDialog from "@/components/general/ssDialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import CourseForm from "./_components/courseForm";
import { CourseList, CourseCard } from "./_components/courseList";
import { getAllSubjects } from "../_actions/course";

const courses = [
  {
    name: "General Science",
    code: "GS1",
    subjects: ["Physics", "Elective Mathematics", "Chemistry"],
  },
];

/** icon imports */
import { PlusIcon } from "lucide-react";

//db
import db from "@/db/db";

export default async function AdminCoursesPage() {
  const subjects = await getAllSubjects()
  return (
    <>
      <div className="flex justify-end mb-8 w-full">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon /> Add Course
            </Button>
          </DialogTrigger>
          <SSDialog title="Add Course">
            <CourseForm subjects={subjects} />
          </SSDialog>
        </Dialog>
      </div>
      <div>
        <CourseList>
          {courses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </CourseList>
      </div>
    </>
  );
}
