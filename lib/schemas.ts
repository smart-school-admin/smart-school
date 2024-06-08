import z from "zod";

export const csvFileSchema = z
  .instanceof(File, { message: "Please select a file" })
  .refine((file) => file.size > 0 && file.name.split(".").pop() === "csv", {
    message: "Please select a csv file",
  });
