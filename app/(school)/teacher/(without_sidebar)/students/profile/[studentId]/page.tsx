import StudentProfile from "@/app/(school)/_components/pages/studentProfile";
import { predictGrades } from "@/app/(school)/school_admin/_actions/student";
import db from "@/db/db";

export default async function StudentProfilePage({
  params,
}: {
  params: { studentId: string };
}) {
  const results: {
    subjectId: number;
    score: number;
    passed: boolean;
    semester: number;
    math_intensive: boolean;
  }[] = await db.$queryRaw`
    SELECT "subjectId", "score", "passed", "semester"
    FROM (
      SELECT 
        *,
        ROW_NUMBER() OVER (PARTITION BY "subjectId"  ORDER BY "dateEntered") AS row_num
      FROM "Grade" WHERE "studentId"=${params.studentId}
    ) AS numbered_rows
    WHERE row_num = 1;
  `;


  const studentData = await db.student.findUnique({
    where: { id: params.studentId },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      other_names: true,
      year: true,
      course: {
        select: {
          name: true,
          code: true,
          subjects: { select: { id: true, code: true, name: true, math_intensive: true } },
        },
      },
    },
  });

  const subjectScores: {
    [key: string]: { score: number; passed: boolean; semester: number };
  } = {};
  results.forEach((item) => {
    subjectScores[item.subjectId] = {
      score: item.score,
      passed: item.passed,
      semester: item.semester,
    };
  });

  // console.log(await predictGrades(params.studentId, results))


  return <StudentProfile studentData={studentData!} grades={subjectScores} />;
}
