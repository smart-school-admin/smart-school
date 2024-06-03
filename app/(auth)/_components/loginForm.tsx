"use client";
/** next imports */
import { useFormState } from "react-dom";

/** component imports */
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/general/forms/submitButton";

/**server actions */
import { authenticate } from "../_actions/authentication";

export default function LoginForm() {
  const [errors, action] = useFormState(authenticate, undefined);
  return (
    <form action={action} className="p-8 flex flex-col gap-4 w-full max-w-xl shadow-sm shadow-slate-500 rounded-lg">
      <div>
        <Label>Email</Label>
        <Input name="email" />
      </div>
      <div>
        <Label>Password</Label>
        <Input name="password" type="password" />
      </div>
      <div className="flex justify-center items-center mt-8">
        <SubmitButton className="rounded-full w-2/3" />
      </div>
      {errors && <span className="text-red-500">{errors}</span>}
    </form>
  );
}
