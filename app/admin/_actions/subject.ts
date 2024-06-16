"use server"

import { object, z } from "zod";
import db from "@/db/db";

const subjectSchema = z.object({
  code: z
    .string()
    .min(3, { message: "Course code must be at least 3 characters long" })
    .max(6, { message: "Course code must be at most 6 characters long" }),
  name: z.string().min(1, "Subject Name must be at least one character long"),
  math_intensive: z.coerce.boolean(),
});

export default async function createSubject(
  prevState: unknown,
  formData: FormData
) {
  const validationResult = subjectSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (validationResult.error)
    return validationResult.error.formErrors.fieldErrors;

  // // check if course code already exists
  const codeExists = !!(await db.subject.findUnique({
    where: { code: validationResult.data.code },
  }));

  if (codeExists) return { errorMessage: "Course code already exists" };

  // inserts
  await db.subject.create({ data: validationResult.data });
}
