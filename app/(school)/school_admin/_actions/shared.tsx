import { auth } from "@/auth";
import db from "@/db/db";
export async function getSchoolIdByEmail(email: string) {
  return (
    await db.user.findUnique({
      where: { email },
      select: { SchoolAdministrator: { select: { schoolId: true } } },
    })
  )?.SchoolAdministrator[0].schoolId;
}

export async function getSessionId() {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return;
  }

  return session.user.id;
}
