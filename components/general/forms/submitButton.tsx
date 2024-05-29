/** react imports */
import React from "react";
import { useFormStatus } from "react-dom";

/** component imports */
import { Button } from "@/components/ui/button";

export default function SubmitButton({
  children="Submit",
}: {
  children?: React.ReactNode;
}) {
  const {pending} = useFormStatus();
  return <Button className="text-2xl py-8">{pending ? "Loading..." : children}</Button>;
}
