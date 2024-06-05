import { Card } from "@/components/ui/card";
import StatCard from "@/app/(school)/_components/cards/statCard";
import Link from "next/link";

/** icon imports */
import { ChevronRight } from "lucide-react";

/** function imports */
import { cn } from "@/lib/utils";

function ViewDetailsLink({
  href,
  className,
}: {
  href: string;
  className: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "w-full rounded-full bg-gray-300 text-xs p-1 text-black flex justify-around items-center",
        className
      )}
    >
      View details <ChevronRight className="w-4 h-4" />
    </Link>
  );
}

function EventItem({
  title,
  date,
  time,
  upcoming,
}: {
  title: string;
  date: string;
  time: string;
  upcoming?: boolean;
}) {
  return (
    <p
      className={cn(
        "flex justify-between text-sm",
        upcoming && "text-red-500 font-semibold"
      )}
    >
      <span>{title}</span>
      <span>
        {date} - {time}
      </span>
    </p>
  );
}

export default function AttendanceAndEvents() {
  return (
    <Card className="p-4">
      <div className="flex gap-2">
        <StatCard className="bg-ssPrimary-100 flex text-white flex-col gap-2">
          <span className="font-semibold">Student Attendance</span>
          <span className="font-semibold">75%</span>
          <ViewDetailsLink href="#" className="mt-auto" />
        </StatCard>
        <StatCard className="bg-ssPrimary-100 flex text-white flex-col gap-2">
          <span className="font-semibold">Teacher Attendance</span>
          <span className="font-semibold">100%</span>
          <ViewDetailsLink href="#" className="mt-auto" />
        </StatCard>
      </div>
      <div className="mt-4">
        <h1 className="text-xl text-center mb-2">Upcoming Events</h1>
        <div className="flex flex-col gap-2">
          <EventItem
            title="Board Meeting"
            date="03/06/24"
            time="3:30pm"
            upcoming
          />
          <EventItem title="Board Meeting" date="03/06/24" time="3:30pm" />
          <EventItem title="Board Meeting" date="03/06/24" time="3:30pm" />
        </div>
      </div>
    </Card>
  );
}
