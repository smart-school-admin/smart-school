"use server";

import * as fs from "fs";
import { auth } from "@/auth";

/** schema imports */
import { csvFileSchema } from "@/lib/schemas";

/** database imports */
import db from "@/db/db";

/** for parsing */
import { parseStream, parseString } from "fast-csv";
import { Student } from "@prisma/client";

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

  // const session = await Session(authConfig);
  // console.log(session)

  console.log(await auth());
  // const data = await getRows(validationResult.data) as Student[];

  // getting the school id
  // const schoolId = db.sc
  
  // try{
  //   await db.student.createMany({data: data})
  // }
  // catch(error:any){
  //   console.log(error)
  // }

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
