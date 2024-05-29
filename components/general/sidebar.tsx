"use client";
/** next imports */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

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
        "h-screen max-w-72 w-full py-4 shadow-sm shadow-gray-600",
        className
      )}
    >
      <h1 className="text-center text-2xl font-semibold mb-8">Title</h1>
      <div className="flex flex-col gap-2 px-4">{children}</div>
    </aside>
  );
}

export function SidebarItem(props: ComponentProps<typeof Link>) {
  return (
    <Link
      href={props.href}
      className={cn(
        "w-100 p-2 rounded-sm hover:bg-gray-200 text-sm flex gap-2 items-center",
        props.className,
        usePathname() == props.href && "bg-ssPrimary-100 font-semibold text-ssPrimary-foreground"
      )}
    >
      {props.children}
    </Link>
  );
}
