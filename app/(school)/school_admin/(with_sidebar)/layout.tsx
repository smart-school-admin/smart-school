/** component imports */
import { Sidebar, SidebarItem } from "@/components/general/sidebar";
import Navbar from "../_components/navbar";

/** icon imports */
import { LayoutDashboardIcon } from "lucide-react";
import { GraduationCapIcon } from "lucide-react";
import { BookUserIcon } from "lucide-react";
import { LogOutIcon } from "lucide-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="h-screen flex">
      <Sidebar>
        <SidebarItem href="/school_admin/dashboard">
          <LayoutDashboardIcon /> Dashboard
        </SidebarItem>
        <SidebarItem href="/school_admin/students">
          <BookUserIcon /> Students
        </SidebarItem>
        <SidebarItem href="/school_admin/teachers">
          <GraduationCapIcon /> Teachers
        </SidebarItem>
        <SidebarItem href="#" className="text-red-500">
          <LogOutIcon /> Logout
        </SidebarItem>
      </Sidebar>
      <div className="h-full flex-grow flex flex-col">
        <Navbar />
        <div className="p-4 flex-grow overflow-auto pb-8">{children}</div>
      </div>
    </section>
  );
}
