import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getTeacherStudents } from "../../../school_admin/_actions/student";
import { Input } from "@/components/ui/input";

export default async function ScoresUploadPage() {
  const response = await getTeacherStudents();
  if (!response.success) {
    return <div>{response.errorMessage}</div>;
  }
  return (
    <div className="p-8">
      <Table>
        <TableCaption>Upload scores for you students</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow> */}
          {response.data.map((student: any) => (
            <TableRow>
              <TableCell>
                {student.first_name} {student.last_name}
              </TableCell>
              <TableCell>
                {student.course.code}-{student.course.name}
              </TableCell>
              <TableCell>some subject</TableCell>
              <TableCell>
                <Input type="number" min={0} max={100} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
