import StudentAttendanceSwitch from "./studentAttendanceSwitch";
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
    <div className="flex flex-col gap-4">
      {students && students.map((student, index) => <div className="flex justify-between p-4 rounded-md">
        <div>{student.first_name} {student.other_names} {student.last_name}</div>
        <div><StudentAttendanceSwitch studentId={student.id}/></div>
      </div>)}
    </div>
  );
}
