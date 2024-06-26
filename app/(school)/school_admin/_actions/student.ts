"use server";

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
} from "@prisma/client";

/** for parsing */
import { parseStream, parseString } from "fast-csv";
import { Student } from "@prisma/client";
import { z } from "zod";

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
  gender: z
    .string()
    .refine((item) => item in GENDER, { message: validMessage }),
  dob: z.date(),
  address_type: z.string().refine((item) => item in ADDRESS_TYPE, {
    message: "Please select valid value",
  }),
  state: z.string().min(1, { message: requiredMessage }),
  city: z.string().min(1, { message: requiredMessage }),
  //family information
  family_size: z
    .string()
    .refine((value) => value in FAMILY_SIZE, { message: validMessage }),
  parent_status: z
    .string()
    .refine((value) => value in PARENT_STATUS, { message: validMessage }),
  mother_job: z
    .string()
    .refine((value) => value in JOB, { message: validMessage }),
  father_job: z
    .string()
    .refine((value) => value in JOB, { message: validMessage }),
  mother_education: z
    .string()
    .refine((value) => value in EDUCATION, { message: validMessage }),
  father_education: z
    .string()
    .refine((value) => value in EDUCATION, { message: validMessage }),
  guardian: z
    .string()
    .refine((value) => value in GUARDIAN, { message: validMessage }),
  family_relationship: z
    .number()
    .min(1, { message: "Value must be at least 1" })
    .max(5, { message: "value must be at most 5" }),

  // education information
  school_choice_reason: z
    .string()
    .refine((value) => value in SCHOOL_CHOICE_REASON, {
      message: validMessage,
    }),
  travel_time: z
    .string()
    .refine((value) => value in TRAVEL_TIME, { message: validMessage }),
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
  study_time: z
    .string()
    .refine((value) => value in TRAVEL_TIME, { message: validMessage }),
  // other information
  internet_access: z
    .string()
    .min(1, { message: requiredMessage })
    .transform((value) => (value === "Yes" ? true : false)),
  romantic_relationship: z
    .string()
    .min(1, { message: requiredMessage })
    .transform((value) => (value === "Yes" ? true : false)),
  social: z
    .number()
    .min(1, { message: "Value must be at least 1" })
    .max(5, { message: "value must be at most 5" }),
  free_time: z
    .number()
    .min(1, { message: "Value must be at least 1" })
    .max(5, { message: "value must be at most 5" }),

  // admission
  course: z.coerce.number().min(1, { message: "Please select a course" }),
  year: z
    .number()
    .min(1, { message: "At least year 1" })
    .max(6, { message: "At most year 6" }),
  email: z.string().email(),
});

export async function addStudent(prevState: unknown, formData: FormData) {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return { errorMessage: "No user in session" };
  }

  const schoolId = (
    await db.user.findUnique({
      where: { email: session.user.email },
      select: { SchoolAdministrator: { select: { schoolId: true } } },
    })
  )?.SchoolAdministrator[0].schoolId;

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
    `${data.first_name}_${data.last_name}`,
    data.image
  );

  let { image, ...studentData } = data;
  const cleaned = { ...studentData, imagePath, schoolId };

  // db.student.create({ data: data });
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
