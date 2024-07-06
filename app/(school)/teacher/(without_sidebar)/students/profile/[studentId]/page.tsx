import StudentProfile from "@/app/(school)/_components/pages/studentProfile";

export default function StudentProfilePage(params: { studentId: string }) {
    return <StudentProfile studentId={params.studentId}/>
}
