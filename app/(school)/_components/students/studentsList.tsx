import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function StudentsList({
  students,
}: {
  students: {
    id: string;
    first_name: string;
    last_name: string;
    other_names?: string;
    email: string;
    indexNumber?: string;
    gender: string;
    age: number;
    imagePath?: string | null;
  }[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Index Number</TableHead>
          <TableHead>Parent Email</TableHead>
          <TableHead>Class</TableHead>
          <TableHead>Gender</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map((student, index) => (
          <TableRow
            key={student.id}
            className="cursor-pointer hover:bg-red-500 hover:text-white"
          >
            <TableCell className="font-medium flex items-center gap-4">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={student.imagePath ?? "https://github.com/shadcn.png"}
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span>
                {student.first_name} {student.last_name}
              </span>
            </TableCell>
            <TableCell>12345</TableCell>
            <TableCell>{student.email}</TableCell>
            <TableCell>SC1</TableCell>
            <TableCell>{student.gender}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
