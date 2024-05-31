/** shadcn imports start */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
/** shadcn imports end */

/** for shadcn start */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
/** for shadcn end */


