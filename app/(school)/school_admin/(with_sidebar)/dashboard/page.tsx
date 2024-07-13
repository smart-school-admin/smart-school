/** component imports */
import StatCard from "@/app/(school)/_components/cards/statCard";
import SSCalendar from "@/components/general/ssCalendar";
import { Card } from "@/components/ui/card";
import AttendanceAndEvents from "./_components/attendanceAndEvents";
import FinanceChart from "./_components/financeChart";

/** icon imports */
import { GraduationCapIcon } from "lucide-react";
import { BookUserIcon } from "lucide-react";
import { BookMarkedIcon } from "lucide-react";

import db from "@/db/db";
import { getDashboardStats } from "../../_actions/student";

export default async function SchoolAdminDashboardPage() {
  const dashboardStats = await getDashboardStats();

  return (
    <div className="w-full min-h-full">
      <span className="text-ssGray-300">Dashboard</span>
      <div className="flex gap-4 flex-wrap mt-4">
        <div className="w-2/3 flex flex-col flex-1 justify-between">
          <div className="grid grid-cols-3 gap-2 my-2">
            <div className="flex justify-center items-center">
            <StatCard label="Students" value={dashboardStats.numStudents}/>
            </div>
            <div className="flex justify-center items-center border-e-2 border-s-2 border-blue-700">
            <StatCard label="Teachers" value={dashboardStats.numTeachers}/>
            </div>
            <div className="flex justify-center items-center">
            <StatCard label="Accounts" value={`GHS ${937}`}/>
            </div>
          </div>
          <Card>
            <div className="w-full h-[450px]">
              <FinanceChart />
            </div>
          </Card>
        </div>
        <div className="flex flex-col gap-8">
          <div>
            <AttendanceAndEvents />
          </div>
          <div className="flex justify-center w-full">
            <SSCalendar className="w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
