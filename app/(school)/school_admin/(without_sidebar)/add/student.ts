"use server";

import * as fs from 'fs';

/** schema imports */
import { csvFileSchema } from "@/lib/schemas";

/** database imports */
import db from "@/db/db";

/** for parsing */
import { parseStream } from "fast-csv";

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

  // return {}

  // read csv file and update the students database
  // parseStream(stream)
  // .on('error', error => console.error(error))
  // .on('data', row => console.log(row))
  // .on('end', (rowCount: number) => console.log(`Parsed ${rowCount} rows`));

  return {};
}
