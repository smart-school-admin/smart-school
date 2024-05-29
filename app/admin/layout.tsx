/** next imports */
import { Metadata } from "next";

/** component imports */
import { Sidebar, SidebarItem } from "@/components/general/sidebar";

/** icon imports */
import { SchoolIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin | Dashboard",
};

export default function AdminDashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="min-h-full flex">
      <Sidebar >
        <SidebarItem href="/admin"><SchoolIcon/> Schools</SidebarItem>
        <SidebarItem href="/second">Second thing</SidebarItem>
      </Sidebar>
      <div className="flex-grow p-4">{children}</div>
    </section>
  );
}
