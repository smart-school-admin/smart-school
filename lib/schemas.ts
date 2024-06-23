import z from "zod";

export const csvFileSchema = z
  .instanceof(File, { message: "Please select a file" })
  .refine((file) => file.size > 0 && file.name.split(".").pop() === "csv", {
    message: "Please select a csv file",
  });

export const fileSchema = z
  .instanceof(File, { message: "Please select a file" })
  .refine((file) => file.size > 0, { message: "file cannot be empty" });

export const imageSchema = fileSchema.refine(
  (file) => file.type.startsWith("image/"),
  { message: "File not an image" }
);
