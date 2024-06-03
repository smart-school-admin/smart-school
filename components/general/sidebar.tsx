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
        "h-screen max-w-72 w-full py-4 shadow-sm shadow-gray-600 bg-black text-white",
        className
      )}
    >
      <h1 className="text-center text-2xl font-semibold mb-8">Smart School</h1>
      <div className="flex flex-col gap-2 px-4">{children}</div>
    </aside>
  );
}

export function SidebarItem(props: ComponentProps<typeof Link>) {
  return (
    <Link
      href={props.href}
      className={cn(
        "w-100 p-2 rounded-sm hover:text-ssPrimary-100 text-sm flex gap-2 items-center transition-colors",
        props.className,
        usePathname() == props.href && "bg-ssPrimary-100 font-semibold text-ssPrimary-foreground hover:text-white"
      )}
    >
      {props.children}
    </Link>
  );
}
