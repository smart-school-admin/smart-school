"use client"
/** react imports */
import React from "react";
import { useFormStatus } from "react-dom";

/** function imports */
import { cn } from "@/lib/utils";

/** component imports */
import { Button } from "@/components/ui/button";

export default function SubmitButton({
  children="Submit",
  className
}: {
  children?: React.ReactNode;
  className?: string
}) {
  const {pending} = useFormStatus();
  return <Button className={cn("text-2xl py-8", className)} aria-disabled={pending}>{pending ? "Loading..." : children}</Button>;
}
