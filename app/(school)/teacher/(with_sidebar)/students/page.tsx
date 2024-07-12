/** next imports */
import Link from "next/link";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import SSDialog from "@/components/general/ssDialog";

/** component imports */
import StudentCard from "@/app/(school)/_components/cards/studentCard";
import { Button } from "@/components/ui/button";
import AttendanceMarker from "../../_components/attendanceMarker";
import StudentsList from "@/app/(school)/_components/students/studentsList";
import { CheckCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

/** functions */
import { getTeacherStudents } from "@/app/(school)/school_admin/_actions/student";

/** icon imports */
import { PlusIcon } from "lucide-react";


export default async function StudentsPage() {
  const response = await getTeacherStudents();
  if (!response.success) {
    return <div>{response.errorMessage}</div>;
  }
  return (
    <div className="w-full min-h-full">
      <h1 className="font-semibold mb-8  mt-4 flex justify-between">
        <span className="text-ssGray-300">Students</span>
        {response && response.data && (
          <Dialog>
            <DialogTrigger asChild>
              {/* <Button>Take Attendance</Button> */}
              <span className="cursor-pointer hover:text-ssPrimary-100"><CheckCircle className="stroke-ssPrimary-100 inline w-4 h-4"/> Attendance</span>
            </DialogTrigger>
              <SSDialog title="Mark Attendance">
                <AttendanceMarker students={response.data} />
              </SSDialog>
          </Dialog>
        )}
      </h1>
      {response.success && response.data && response.data.length < 0 && (
        <div className="text-center">No students found</div>
      )}
      {response.success && response.data && response.data.length > 0 && (
        <div className="flex flex-col gap-6">
          {response.data && (<StudentsList students={response.data}/>)
           }
          {/* {response.data &&
            response.data.map((student: any, index: number) => (
              <StudentCard
                key={index}
                studentId={student.id}
                firstName={student.first_name}
                lastName={student.last_name}
                otherNames={student.other_names}
                course={`${student.course.code}-${student.course.name}`}
                image={student.imagePath ?? undefined}
              />
            ))} */}
        </div>
      )}
    </div>
  );
}
