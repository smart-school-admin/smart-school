/** component imports */
import StatCard from "../../_components/cards/statCard";
import SSCalendar from "@/components/general/ssCalendar";
import { Card } from "@/components/ui/card";
import AttendanceAndEvents from "./_components/attendanceAndEvents";
import FinanceChart from "./_components/financeChart";

/** icon imports */
import { GraduationCapIcon } from "lucide-react";
import { BookUserIcon } from "lucide-react";
import { BookMarkedIcon } from "lucide-react";

export default function SchoolAdminDashboardPage() {
  return (
    <div className="w-full min-h-full">
      <h1 className="text-2xl font-semibold mb-8">Dashboard</h1>
      <div className="flex gap-4 flex-wrap">
        <div className="w-2/3 flex flex-col flex-1 justify-between">
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
