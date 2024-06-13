/** component imports */
import { Button } from "@/components/ui/button";
import SSDialog from "@/components/general/ssDialog";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

/** icon imports */
import { PlusIcon } from "lucide-react";

export default function AdminCoursesPage() {
  return (
    <>
      <div className="flex justify-end mb-8 w-full">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon /> Add School
            </Button>
          </DialogTrigger>
          <SSDialog title="Add School">
            <div></div>
          </SSDialog>
        </Dialog>
      </div>
    </>
  );
}
