import { z } from "zod";

const fileSchema = z.instanceof(File).refine((file) => file.size > 0);

const requiredMessage = "This field is required";
const addSchoolSchema = z.object({
  name: z.string({message: requiredMessage}),
  region: z.string({message: requiredMessage}),
  district: z.string({message: requiredMessage}),
  // badgeImage: z.instanceof(File)
});

export async function addSchool(prevState: unknown, formData: FormData) {
  const validationResult = addSchoolSchema.safeParse(formData);

  if (!validationResult.success)
    return validationResult.error.formErrors.fieldErrors;

  // else add to database
}
