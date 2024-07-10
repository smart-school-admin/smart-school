import StudentAttendanceSwitch from "./studentAttendanceSwitch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// server actions
import { getTodaysAttendance } from "../../school_admin/_actions/student";

export default function AttendanceMarker({
  students,
}: {
  students: {
    id: string;
    first_name: string;
    other_names: string;
    last_name: string;
  }[];
}) {
  return (
    <div>
      <div className="flex justify-center items-center gap-4 mb-8">
        <Label>
          Meeting
        </Label>
        <Input type="number" min={1} max={20} className="w-24 h-8 outline-none"/>
      </div>
      <div className="flex flex-col gap-4">
        {students &&
          students.map((student, index) => (
            <div className="flex justify-between p-4 rounded-md">
              <div>
                {student.first_name} {student.other_names} {student.last_name}
              </div>
              <div>
                <StudentAttendanceSwitch studentId={student.id} />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
