import { FileBoxIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ScoreCard({
  subjectName,
  subjectCode,
  score,
  passed,
}: {
  subjectName: string;
  subjectCode: string;
  score?: number;
  passed?: boolean;
}) {
  return (
    <div className="flex justify-between items-center p-4 gap-4 w-full rounded-md border-gray-500 border-2 bg-white">
      <FileBoxIcon className="fill-white" />
      <div className="flex justify-between items-center flex-grow">
        <div>
          {subjectCode}-{subjectName}
        </div>
        {score !== undefined && (
          <div
            className={cn(
              passed ? "text-green-500" : "text-red-500",
              "text-xl font-semibold"
            )}
          >
            {score}%
          </div>
        )}
        {score === undefined && <div className="text-gray-500 text-xl font-semibold">?</div>}
      </div>
    </div>
  );
}
