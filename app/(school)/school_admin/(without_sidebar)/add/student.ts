"use server";

import * as fs from "fs";

/** schema imports */
import { csvFileSchema } from "@/lib/schemas";

/** database imports */
import db from "@/db/db";

/** for parsing */
import papa from "papaparse";
import { parseStream, parseString } from "fast-csv";

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


  const data = await getRows(validationResult.data);
  console.log(data)

  return {};
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
