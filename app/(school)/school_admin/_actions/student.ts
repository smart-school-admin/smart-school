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
import { ML_API_ENDPOINTS } from "@/lib/endpoints";
import path from "path";
import axios, { AxiosError } from "axios";

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
// type TeacherStudent = {
//   first_name: string;
//   last_name: string;
// }
export async function getTeacherStudents(): Promise<{
  errorMessage?: string;
  data?: {
    id: string;
    first_name: string;
    last_name: string;
    other_names: string;
    course: {
      code: string;
      name: string;
      subjects: {
        id: number;
      }[];
    };
    imagePath: string | null;
  }[];
  success?: boolean;
}> {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    redirect("/");
  }

  const teacherId = session.user.id;

  const schoolId = (
    await db.teacher.findUnique({
      where: { id: teacherId },
      select: { schoolId: true },
    })
  )?.schoolId;

  if (!schoolId)
    return { errorMessage: "You are not affiliated with a school" };

  const subject = await db.teacher.findUnique({
    where: { id: teacherId },
    select: { subjectId: true },
  });

  if (!subject)
    return { errorMessage: "subject does not exist", success: false };

  const students = await db.student.findMany({
    where: { schoolId: schoolId },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      other_names: true,
      imagePath: true,
      course: {
        select: {
          code: true,
          name: true,
          subjects: {
            where: { id: subject.subjectId },
            select: { id: true },
          },
        },
      },
    },
  });

  return {
    success: true,
    data: students.filter((student) => student.course.subjects.length > 0),
  };
}

export async function uploadStudentScores(data: {
  scores: { [key: string]: number };
  passMark: number;
  semester: number;
}) {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return;
  }

  const teacherId = session.user.id;

  const subject = await db.teacher.findUnique({
    where: { id: teacherId },
    select: { subjectId: true },
  });

  if (!subject)
    return { errorMessage: "subject does not exist", success: false };

  const subjectId = subject.subjectId;

  const entries = [];
  for (let key in data.scores) {
    entries.push({
      studentId: key,
      score: data.scores[key],
      passed: data.scores[key] > data.passMark,
      subjectId: subjectId,
      semester: data.semester,
    });
  }

  const response = await db.grade.createMany({ data: entries });
  return { success: true, data: entries.length };
}

export async function predictGrades(
  studentId: string,
  grades: {
    subjectId: number;
    score: number;
    passed: boolean;
    math_intensive: boolean;
  }[]
) {
  if (!grades || grades.length < 1) return;

  const samples: any = [];
  // getting student data with number of failures
  const student = await db.student.findUnique({
    where: { id: studentId },
    include: {
      _count: {
        select: {
          grades: { where: { passed: false } },
          attendance: { where: { present: false } },
        },
      },
    },
  });

  if (!student) return;

  const { _count, ...studentData } = student;
  grades.forEach((grade) => {
    samples.push({
      ...studentData,
      absences: _count.attendance,
      class_failures: _count.grades,
      math_intensive: grade.math_intensive,
      previous_grade: grade.score,
    });
  });

  try {
    const response = await axios.post(
      `${process.env.ML_API_ROOT}/${ML_API_ENDPOINTS.studentGradePredict}`,
      samples,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const predictions: { [key: string]: number } = {};
    response.data.predictions.forEach((pred: number, index: number) => {
      predictions[grades[index].subjectId] = pred;
    });
    return {success: {predictions: predictions, explanations: response.data.explanations}};
  } catch (error: any) {
    if (error.response) {
      return {
        error: `${error.status}:${error.message ?? "unfavorable response"}`,
      };
    } else if (error.request) {
      return { error: error.message ? error.message : "No response received" };
    } else {
      return { error: error.message ?? "Something went wrong" };
    }
  }
}
