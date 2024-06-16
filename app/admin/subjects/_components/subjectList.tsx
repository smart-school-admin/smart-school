import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReactElement } from "react";

// types
type subjectProp = {
  code: string;
  name: string;
};

export function SubjectList({
  children,
}: {
  children:
    | ReactElement<typeof SubjectCard>
    | Array<ReactElement<typeof SubjectCard>>;
}) {
  return <div className="grid grid-cols-2 gap-8">{children}</div>;
}

export function SubjectCard({ code, name }: subjectProp) {
  return (
    <Card className="rounded-md py-4 px-8 flex justify-between items-center text-sm">
      <div className="flex flex-col gap-4">
        <h2 className="text-gray-600">Subject Code</h2>
        <span>MA1</span>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-gray-600">Subject Name</h2>
        <span>Core Mathematics</span>
      </div>
      <div className="flex gap-2">
        <Button>Edit</Button>
        <Button variant="destructive">Delete</Button>
      </div>
    </Card>
  );
}
