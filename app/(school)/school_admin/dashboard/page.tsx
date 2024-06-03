/** component cards */
import StatCard from "../../_components/cards/statCard";
import SSCalendar from "@/components/general/ssCalendar";
import { Card } from "@/components/ui/card";
import AttendanceAndEvents from "./attendanceAndEvents";

/** icon imports */
import { GraduationCapIcon } from "lucide-react";
import { BookUserIcon } from "lucide-react";
import { BookMarkedIcon } from "lucide-react";

export default function SchoolAdminDashboardPage() {
  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-3 my-4 gap-2">
        <div className="col-span-2">
          <div className="grid grid-cols-3 gap-2">
            <StatCard>
              <div className="flex items-center justify-center text-2xl gap-2 py-2">
                <GraduationCapIcon className="w-8 h-8" />
                Students
              </div>
              <div className="text-gray-500 text-center pb-2 text-lg">2234</div>
            </StatCard>
            <StatCard>
              <div className="flex items-center justify-center text-2xl gap-2 py-2">
                <BookUserIcon className="w-8 h-8" />
                Teachers
              </div>
              <div className="text-gray-500 text-center pb-2 text-lg">72</div>
            </StatCard>
            <StatCard>
              <div className="flex items-center justify-center text-2xl gap-2 py-2">
                <BookMarkedIcon className="w-8 h-8" />
                Accounts
              </div>
              <div className="text-gray-500 text-center pb-2 text-lg">
                GHS 2000
              </div>
            </StatCard>
          </div>
        </div>
        <div>
          <AttendanceAndEvents/>
        </div>
        <div className="flex justify-center">
          <SSCalendar />
        </div>
      </div>
    </div>
  );
}
