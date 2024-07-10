"use client";
import { useTransition } from "react";
import { Switch } from "@/components/ui/switch";
import { markStudentAttendance } from "../../school_admin/_actions/student";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

// server actions
import { getTodaysAttendenceStudent } from "../../school_admin/_actions/student";

export default function StudentAttendanceSwitch({
  studentId,
}: {
  studentId: string;
}) {
  const {
    data: todaysAttendance,
    error,
    isLoading,
  } = useQuery({
    queryKey: [studentId],
    queryFn: async () => await getTodaysAttendenceStudent(studentId),
  });
  const [pending, startTransition] = useTransition();
  return (
    <Switch
      defaultChecked={todaysAttendance?.present}
      disabled={pending || isLoading}
      onCheckedChange={(check) =>
        startTransition(async () => {
          await markStudentAttendance(studentId, check);
          toast.success("Attendance");
        })
      }
    />
  );
}
