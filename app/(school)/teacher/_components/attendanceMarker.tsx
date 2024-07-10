"use client";
import { useState } from "react";

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
  const [meeting, setMeeting] = useState<number>(1);

  return (
    <div>
      <div className="flex justify-center items-center gap-4 mb-8">
        <Label>Meeting</Label>
        <Input
          type="number"
          value={meeting}
          onChange={(event) => {
            setMeeting(parseInt(event.target.value));
          }}
          min={1}
          max={20}
          className="w-24 h-8 outline-none"
        />
      </div>
      <div className="flex flex-col gap-4">
        {students &&
          students.map((student, index) => (
            <div className="flex justify-between p-4 rounded-md">
              <div>
                {student.first_name} {student.other_names} {student.last_name}
              </div>
              <div>
                <StudentAttendanceSwitch
                  key={index}
                  studentId={student.id}
                  meeting={meeting}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
