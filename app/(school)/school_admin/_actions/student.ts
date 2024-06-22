"use server";

import * as fs from "fs";
import { auth } from "@/auth";

/** schema imports */
import { csvFileSchema } from "@/lib/schemas";

/** database imports */
import db from "@/db/db";
import { ADDRESS_TYPE, GENDER } from "@prisma/client";

/** for parsing */
import { parseStream, parseString } from "fast-csv";
import { Student } from "@prisma/client";
import { z } from "zod";

const requiredMessage = "This field is required"
/** schema for student data */
const schema = z.object({
  first_name: z.string().min(1, {message: requiredMessage}),
  last_name: z.string().min(1, {message: requiredMessage}),
  other_names: z.string().min(1, {message: requiredMessage}),
  age: z.coerce.number({message: "Please enter a number"}),
  gender: z.string().refine(item => item in GENDER, {message: requiredMessage}),
  dob: z.date(),
  address_type: z.string().refine(item => item in ADDRESS_TYPE)

})


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

export default async function addStudentsFromFile(
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

export async function addStudent(prevState: unknown, formData: FormData){

}
