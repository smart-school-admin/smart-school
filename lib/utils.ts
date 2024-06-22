/** shadcn imports start */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { string } from "zod";
/** shadcn imports end */

/** for shadcn start */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/** for shadcn end */

export function objectToOptions(container: {
  [key: string]: string;
}): { name: string; value: string }[] {
  const holder: { name: string; value: string }[] = [];

  for (let key in container) {
    holder.push({ name: container[key].split("_").join(" "), value: container[key] });
  }

  return holder;
}
