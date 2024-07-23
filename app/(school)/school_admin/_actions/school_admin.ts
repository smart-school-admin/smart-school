import db from "@/db/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

/** function to get total number of students in school */
export default async function getTotalStudents(schoolId: string) {
    return (
      await db.student.aggregate({
        where: { schoolId: schoolId },
        _count: {
          id: true,
        },
      })
    )._count.id;
  }
  
  /** function to get total number of teachers */
  export async function getTotalTeachers(schoolId: string) {
    return (
      await db.teacher.aggregate({
        where: { schoolId: schoolId },
        _count: {
          id: true,
        },
      })
    )._count.id;
  }
  
  export async function getTotalPresents(schoolId: string){
    const presents = await db.attendance.aggregate({
      where: {present: true},
      _count:{
        id: true
      }
    })
  
    return presents._count.id;
  }

  export async function getTotalMeetings(schoolId:string){
    return (await db.attendance.aggregate({
        _count:{
          id: true
        }
      }))._count.id
  }
  
  /** function to get dashboard information for school admin */
  export async function getDashboardStats() {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
      redirect("/");
    }
  
    const adminId = session.user.id;
  
    const school = await db.schoolAdministrator.findUnique({
      where: { id: adminId },
      select: { schoolId: true },
    });
  
    if (!school) redirect("/");
  
    return {
      numStudents: await getTotalStudents(school?.schoolId),
      numTeachers: await getTotalTeachers(school?.schoolId),
      totalStudentPresent: await getTotalPresents(school?.schoolId),
      totalMeetings: await getTotalMeetings(school.schoolId)
      
    };
  }