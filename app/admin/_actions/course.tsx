import z from "zod";
import db from "@/db/db";

const courseSchema = z.object({
  code: z.string().min(2, "At least 2 characters"),
  name: z.string().min(1, "Field required"),
  subjects: z
    .string()
    .array()
    .min(1, "A course must have at least one subject"),
});

export async function createCourse(data: {
  name: string;
  code: string;
  subjects: string[];
}) {
    const validationResult = courseSchema.safeParse(data);

    if(!validationResult.success)
        return validationResult.error.formErrors.fieldErrors;

    // check if course code already exists
    // const exists = !!(await db.course.findUnique({where: {code: validationResult.code}}))

    // db.course.create({data: validationResult.data})
}
