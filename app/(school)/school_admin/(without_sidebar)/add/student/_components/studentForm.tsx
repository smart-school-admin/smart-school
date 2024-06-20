"use client";
/** react imports */
import { useFormState } from "react-dom";

/** component imports */
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SSSelect from "@/components/general/forms/ssSelect";
import DateInput from "@/components/general/forms/dateInput";
import SubmitButton from "@/components/general/forms/submitButton";

export default function StudentForm({
  schools,
  courses,
}: {
  schools: { id: string; name: string }[];
  courses: { id: number; code: string; name: string }[];
}) {
  // const[errors, action] = useFormState()
  return (
    <form className="py-4 flex flex-col gap-8 w-full">
      <div className="w-full py-4 flex flex-col gap-4">
        <h2 className="font-semibold">Demographic Information</h2>
        <div className="flex gap-4">
          <div className="flex-grow">
            <Label>First Name</Label>
            <Input name="first_name" />
          </div>
          <div className="flex-grow">
            <Label>Last Name</Label>
            <Input name="last_name" />
          </div>
        </div>
        <div>
          <Label>Other Names</Label>
          <Input name="other_names" />
        </div>
        <div className="flex gap-4">
          <div className="flex-grow">
            <Label>Age</Label>
            <Input name="age" type="number" min={5} max={30} />
          </div>
          <div className="flex-grow">
            <Label>Date of Birth</Label>
            <DateInput />
          </div>
        </div>
      </div>
      <SubmitButton />
    </form>
  );
}
