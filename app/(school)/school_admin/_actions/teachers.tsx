import { z } from "zod";

import { EDUCATION, GENDER } from "@prisma/client";
import { auth } from "@/auth";
import { getSchoolIdByEmail } from "./shared";
import { saveFilePublic } from "@/app/_utils/utils";
import { imageSchema } from "@/lib/schemas";
import db from "@/db/db";

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
  length_of_service: z.number().min(0, { message: "Please enter valid value" }),
  num_seminars_attended: z
    .number()
    .min(0, { message: "Please enter valid value" }),
  subjectId: z.coerce.number().min(1, { message: "Please select a subject" }),
});

export async function addTeacher(prevState: unknown, formData: FormData) {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    return { errorMessage: "No user in session" };
  }

  const schoolId = await getSchoolIdByEmail(session.user.email);

  if (!schoolId) return { errorMessage: "School not found" };

  const validationResult = createTeacherSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validationResult.success)
    return validationResult.error.formErrors.fieldErrors;

  const data = validationResult.data;

  // upload file
  const imagePath = await saveFilePublic(
    "/teachers/",
    `${data.first_name}_${data.last_name}_${data.image.name}`,
    data.image
  );

  let { image, ...teacherData } = data;
  const cleaned = { ...teacherData, imagePath, schoolId };

  await db.teacher.create({ data: cleaned });
}
