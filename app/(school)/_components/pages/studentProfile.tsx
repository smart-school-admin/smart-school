import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
export default function StudentProfile({ studentId }: { studentId: string }) {
  return (
    <div className="h-screen p-4">
      <Card className="h-full overflow-hidden">
        <CardContent className="flex p-0 w-full h-full">
          <div className="flex flex-col h-full bg-black px-8 py-4 text-white w-72">
            <div className="text-center text-xl mb-4">KOJO KUUMSON</div>
            <Avatar className="w-52 h-52">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="grid grid-cols-2 mt-4 text-center gap-y-3">
                <span>Nationality</span> <span>Ghanaian</span>
                <span>Region</span> <span>Some</span>
                <span>District</span> <span>Where</span>
                <span>Course</span> <span>MC1-Core Mathematics</span>
                <span>CLASS</span> <span>2</span>
            </div>
          </div>
          <div className="flex-grow p-4">
            <Card>
                <CardContent>
                    <h2 className="text-center uppercase text-xl">GRADES</h2>
                </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
