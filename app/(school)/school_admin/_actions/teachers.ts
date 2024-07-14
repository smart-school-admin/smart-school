"use server";

import { z } from "zod";

import { EDUCATION, GENDER, Teacher, USER_ROLE } from "@prisma/client";
import { auth } from "@/auth";
import { getSchoolIdByEmail } from "./shared";
import { hashPassword, saveFilePublic } from "@/app/_utils/utils";
import { imageSchema } from "@/lib/schemas";
import db from "@/db/db";
import { SECURITY } from "@/lib/constants";
import { redirect } from "next/navigation";

const requiredMessage = "Required";
const createTeacherSchema = z.object({
  image: imageSchema.refine((file) => file.size < 2 * 1024 * 1024, {
    message: "Image file should be at most 2MB",
  }),
  first_name: z.string().min(1, { message: requiredMessage }),
  last_name: z.string().min(1, { message: requiredMessage }),
  other_names: z.string().min(1, { message: requiredMessage }),
  age: z.coerce.number({ message: "Please enter a number" }),
  gender: z.nativeEnum(GENDER),
  dob: z.coerce.date(),
  country: z.string().min(1, { message: requiredMessage }),
  state: z.string().min(1, { message: requiredMessage }),
  city: z.string().min(1, { message: requiredMessage }),
  educational_level: z.nativeEnum(EDUCATION),
  length_of_service: z.coerce
    .number()
    .min(0, { message: "Please enter valid value" }),
  num_seminars_attended: z.coerce
    .number()
    .min(0, { message: "Please enter valid value" }),
  subjectId: z.coerce.number().min(1, { message: "Please select a subject" }),
  email: z.string().email(),
  password: z
    .string()
    .refine((password) => SECURITY.PASSWORD_REGEX.test(password), {
      message: SECURITY.PASSWORD_ERROR_MSG,
    }),
});

export async function addTeacher(prevState: unknown, formData: FormData) {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return { errorMessage: "No user in session" };
  }

  const validationResult = createTeacherSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validationResult.success)
    return validationResult.error.formErrors.fieldErrors;

  const data = validationResult.data;

  const exists = !!(await db.user.findUnique({ where: { email: data.email } }));
  if (exists) return { errorMessage: "user already exists" };

  try {
    // create the user
    const user = await db.user.create({
      data: {
        email: data.email,
        password: hashPassword(data.password),
        role: USER_ROLE.teacher,
      },
    });

    // get school id
    const schoolId = await getSchoolIdByEmail(session.user.email);
    if (!schoolId) return { errorMessage: "School not found" };

    // upload file
    const imagePath = await saveFilePublic(
      "/teachers/",
      `${data.first_name}_${data.last_name}_${data.image.name}`,
      data.image
    );

    let { image, email, password, ...teacherData } = data;
    const cleaned = { ...teacherData, imagePath, schoolId, id: user.id };

    await db.teacher.create({ data: cleaned });
  } catch (err: any) {
    return { errorMessage: err.message ?? "Something went wrong" };
  }

  redirect("/school_admin/teachers");
}

export async function getTeachers(): Promise<{
  errorMessage?: string;
  data?: ({ subject: { name: string; code: string } } & Teacher & {
      user: { email: string };
    })[];
  success?: boolean;
}> {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return { errorMessage: "No user in session", success: false };
  }

  const schoolId = (
    await db.schoolAdministrator.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        schoolId: true,
      },
    })
  )?.schoolId;

  if (!schoolId) redirect("/");

  const data = await db.teacher.findMany({
    where: { schoolId: schoolId },
    include: {
      subject: { select: { name: true, code: true } },
      user: { select: { email: true } },
    },
  });

  return { data: data, success: true };
}

export async function getTeacherDetails(teacherId: string) {
  return await db.teacher.findUnique({
    where: { id: teacherId },
    include: {
      subject: { select: { name: true, code: true } },
      user: { select: { email: true } },
    },
  });
}

/** stats related functions */
export async function getTotalMeetings(teacherId: string) {
  return (
    await db.attendance.aggregate({
      where: { teacherId: teacherId },
      _count: {
        teacherId: true,
      },
    })
  )._count.teacherId;
}

export async function getTotalTodaysMeetings(teacherId: string) {
  return (
    await db.attendance.aggregate({
      where: { teacherId: teacherId, date: new Date() },
      _count: {
        teacherId: true,
      },
    })
  )._count.teacherId;
}

// export async function getAvgStudentPerformance(teacherId: string){
//   const results = await db.grade.findMany({
//     where: {
//       student:{
//         schoolId: "schoolid"
//       },
//       subject:{
//         Teacher:{
          
//         }
//       }
//     },
//     select:{score: true}
//   })
// }

export async function getTeacherProfileStats(teacherId: string){
  return {
    totalLessons: await getTotalMeetings(teacherId),
    totalTodaysLessons: await getTotalTodaysMeetings(teacherId)
  }
}
