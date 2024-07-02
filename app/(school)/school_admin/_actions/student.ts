"use server";
/** next imports */
import { redirect } from "next/navigation";

import * as fs from "fs";
import { auth } from "@/auth";

/** schema imports */
import { csvFileSchema, imageSchema } from "@/lib/schemas";
import { saveFilePublic } from "@/app/_utils/utils";

/** database imports */
import db from "@/db/db";
import {
  ADDRESS_TYPE,
  EDUCATION,
  FAMILY_SIZE,
  GENDER,
  GUARDIAN,
  JOB,
  PARENT_STATUS,
  SCHOOL_CHOICE_REASON,
  TRAVEL_TIME,
  WEEKLY_STUDY_TIME,
} from "@prisma/client";

/** for parsing */
import { parseStream, parseString } from "fast-csv";
import { Student } from "@prisma/client";
import { TypeOf, z } from "zod";

/** functions */
import { getSchoolIdByEmail } from "./shared";

const requiredMessage = "This field is required";
const validMessage = "Please select valid value";
/** schema for student data */
const studentSchema = z.object({
  // image
  image: imageSchema.refine((file) => file.size < 2 * 1024 * 1024, {
    message: "Image file should be at most 2MB",
  }),
  // personal information
  first_name: z.string().min(1, { message: requiredMessage }),
  last_name: z.string().min(1, { message: requiredMessage }),
  other_names: z.string().min(1, { message: requiredMessage }),
  age: z.coerce.number({ message: "Please enter a number" }),
  gender: z.nativeEnum(GENDER),
  dob: z.coerce.date(),
  address_type: z.nativeEnum(ADDRESS_TYPE),
  state: z.string().min(1, { message: requiredMessage }),
  city: z.string().min(1, { message: requiredMessage }),
  //family information
  family_size: z.nativeEnum(FAMILY_SIZE),
  parent_status: z.nativeEnum(PARENT_STATUS),
  mother_job: z.nativeEnum(JOB),
  father_job: z.nativeEnum(JOB),
  mother_education: z.nativeEnum(EDUCATION),
  father_education: z.nativeEnum(EDUCATION),
  guardian: z.nativeEnum(GUARDIAN),
  family_relationship: z.coerce
    .number()
    .min(1, { message: "Value must be at least 1" })
    .max(5, { message: "value must be at most 5" }),

  // education information
  school_choice_reason: z.nativeEnum(SCHOOL_CHOICE_REASON),
  travel_time: z.nativeEnum(TRAVEL_TIME),
  nursery_school: z
    .string()
    .min(1, { message: requiredMessage })
    .transform((value) => (value === "Yes" ? true : false)),
  family_support: z
    .string()
    .min(1, { message: requiredMessage })
    .transform((value) => (value === "Yes" ? true : false)),
  school_support: z
    .string()
    .min(1, { message: requiredMessage })
    .transform((value) => (value === "Yes" ? true : false)),
  activities: z
    .string()
    .min(1, { message: requiredMessage })
    .transform((value) => (value === "Yes" ? true : false)),
  extra_paid_classes: z
    .string()
    .min(1, { message: requiredMessage })
    .transform((value) => (value === "Yes" ? true : false)),
  higher_ed: z
    .string()
    .min(1, { message: requiredMessage })
    .transform((value) => (value === "Yes" ? true : false)),
  study_time: z.nativeEnum(WEEKLY_STUDY_TIME),
  // other information
  internet_access: z
    .string()
    .min(1, { message: requiredMessage })
    .transform((value) => (value === "Yes" ? true : false)),
  romantic_relationship: z
    .string()
    .min(1, { message: requiredMessage })
    .transform((value) => (value === "Yes" ? true : false)),
  social: z.coerce
    .number()
    .min(1, { message: "Value must be at least 1" })
    .max(5, { message: "value must be at most 5" }),
  free_time: z.coerce
    .number()
    .min(1, { message: "Value must be at least 1" })
    .max(5, { message: "value must be at most 5" }),

  // admission
  courseId: z.coerce.number().min(1, { message: "Please select a course" }),
  year: z.coerce
    .number()
    .min(1, { message: "At least year 1" })
    .max(6, { message: "At most year 6" }),
  email: z.string().email(),
});

/** function to add a single student */
export async function addStudent(prevState: unknown, formData: FormData) {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return { errorMessage: "No user in session" };
  }

  const schoolId = await getSchoolIdByEmail(session.user.email);

  if (!schoolId) return { errorMessage: "School not found" };

  const validationResult = studentSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validationResult.success)
    return validationResult.error.formErrors.fieldErrors;

  const data = validationResult.data;

  // upload file
  const imagePath = await saveFilePublic(
    "/students/",
    `${data.first_name}_${data.last_name}_${data.image.name}`,
    data.image
  );

  let { image, ...studentData } = data;
  const cleaned = { ...studentData, imagePath, schoolId };

  await db.student.create({ data: cleaned });
}

/** function to get all students of school */
export async function getAllStudents() {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    redirect("/");
  }

  const schoolId = await getSchoolIdByEmail(session.user.email);

  return await db.student.findMany({
    where: { schoolId },
    include: { course: { select: { name: true, code: true } } },
  });
}

async function getRows(file: File) {
  const textData = await file.text();
  return new Promise((resolve, reject) => {
    let result: { [key: string]: any }[] = [];
    parseString(textData, { headers: true })
      .on("data", (row) => result.push(row))
      .on("end", () => resolve(result));
  }).catch((err) => {
    throw err;
  });
}

export async function addStudentsFromFile(
  prevState: unknown,
  formData: FormData
) {
  const validationResult = csvFileSchema.safeParse(
    formData.get("studentsFile")
  );
  if (!validationResult.success) {
    console.log(validationResult.error.formErrors.fieldErrors);
    return validationResult.error?.errors[0].message;
  }

  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return;
  }

  const user = await db.user.findUnique({
    where: { email: session?.user?.email! },
    select: { id: true },
  });

  if (!user) return;
  const admin = await db.schoolAdministrator.findUnique({
    where: { id: user.id },
    select: { schoolId: true },
  });

  const schoolId = admin?.schoolId;
  let students = (await getRows(validationResult.data)) as Student[];
  students = students.map((student) => ({ ...student, schoolId: schoolId! }));

  // adding the students
  await db.student.createMany({ data: students });

  return {};
}

/** function to get students by Id and by school */
export async function getTeacherStudents(): Promise<{
  errorMessage?: string;
  data?: any;
  success?: boolean;
}> {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    redirect("/");
  }

  const schoolId = getSchoolIdByEmail(session.user.email);
  const teacher = await db.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  });

  if (!teacher) return { errorMessage: "Teacher not found", success: false };
  const teacherId = teacher.id;

  const subject = await db.teacher.findUnique({
    where: { id: teacherId },
    select: { subjectId: true },
  });
  if (!subject)
    return { errorMessage: "subject does not exist", success: false };

  const students = await db.student.findMany({
    include: {
      course: {
        include: {
          subjects: {
            where: { id: subject.subjectId },
            select: { id: true },
          },
        },
      },
    },
  });

  console.log(students);
  return { success: true, data: students };
}
