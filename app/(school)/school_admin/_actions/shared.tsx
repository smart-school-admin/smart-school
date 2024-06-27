import db from "@/db/db";
export async function getSchoolIdByEmail(email: string) {
  return (
    await db.user.findUnique({
      where: { email },
      select: { SchoolAdministrator: { select: { schoolId: true } } },
    })
  )?.SchoolAdministrator[0].schoolId;
}
