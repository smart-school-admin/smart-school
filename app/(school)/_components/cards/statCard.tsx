/** react imports */
import { ReactNode } from "react";

/** function imports */
import { cn } from "@/lib/utils";

export default function StatCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full rounded-lg shadow-sm shadow-gray-600 p-2",
        className
      )}
    >
      {children}
    </div>
  );
}
