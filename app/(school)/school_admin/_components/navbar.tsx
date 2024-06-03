/** component imports */
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  return (
    <div className="flex justify-end p-4 shadow-inner shadow-gray-600">
      <div className="flex items-center gap-1">
      <span className="text-sm">Admin<br/> Name</span>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      </div>
    </div>
  );
}
