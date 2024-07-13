"use client";
/** next imports */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";
import { BrainIcon } from "lucide-react";

/** function imports */
import { cn } from "@/lib/utils";

export function Sidebar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "h-screen w-60 shadow-sm shadow-gray-600 bg-ssPrimary-100 text-white",
        className
      )}
    >
      <div className="flex justify-center items-center py-8">
        <h1 className="w-20 h-20 bg-white text-ssPrimary-100 rounded-full flex justify-center items-center font-semibold text-lg flex-col">
          <BrainIcon className="fill-ssPrimary-100 stroke-white" />
          SSA
        </h1>
      </div>
      <hr className="mb-4" />
      <div className="flex flex-col gap-2 px-4">{children}</div>
    </aside>
  );
}

export function SidebarItem(props: ComponentProps<typeof Link>) {
  return (
    <Link
      href={props.href}
      className={cn(
        "w-100 p-2 rounded-sm text-sm flex gap-2 items-center transition-colors hover:text-muted-foreground",
        props.className,
        usePathname() == props.href &&
          "bg-slate-100/50"
      )}
    >
      {props.children}
    </Link>
  );
}
