import { z } from "zod";

const requiredMessage = "This field is required";
const fileSizeMessage = "File must be less than 10mb";
const fileSchema = z.instanceof(File, { message: requiredMessage });

const imageSchema = fileSchema.refine(
  (file) => file.size !== 0 || file.type.startsWith("/image")
);

const addSchoolSchema = z.object({
  name: z.string({ message: requiredMessage }),
  region: z.string({ message: requiredMessage }),
  district: z.string({ message: requiredMessage }),
  badgeImage: imageSchema.refine((file) => file.size < 10 * 1000000, {
    message: fileSizeMessage,
  }),
  // section for admin details
  firstName: z.string({ message: requiredMessage }),
  lastName: z.string({ message: requiredMessage }),
  otherNames: z.string({ message: "Text Required" }).optional(),
  email: z.string().email(),
  password: z.string(),
  profileImage: imageSchema.refine(
    (file) => file.size > 0 && file.size < 10 * 1000000,
    { message: fileSizeMessage }
  ),
});

export async function addSchool(prevState: unknown, formData: FormData) {
  const validationResult = addSchoolSchema.safeParse(formData);

  if (!validationResult.success)
    return validationResult.error.formErrors.fieldErrors;

  // else add to database
}
