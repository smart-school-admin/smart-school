import fs from "fs/promises";
import path from "path";
import bcrypt from "bcrypt";

/** function to save file */
export async function saveFile(dirPath: string, saveName: string, file: File) {
  await fs.mkdir(dirPath, { recursive: true });
  const filePath = path.join(dirPath, `${crypto.randomUUID()}-${saveName}`);
  await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
  return filePath;
}

/** function to hash password */
export function hashPassword(password: string) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

/** function to compare hash with plain text */
export function comparePasswords(plainText: string, hash: string) {
  return bcrypt.compareSync(plainText, hash);
}

/** function to encrypt password */
