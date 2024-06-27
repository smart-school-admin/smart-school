/** component imports */
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import db from "@/db/db";
import MultiTeachersUpload from "./_components/multileTeachersUploadForm";

export default async function AddStudentPage() {
  const subjects = await db.subject.findMany({
    select: { id: true, name: true },
  });

  return (
    <div className="w-full max-w-3xl">
      <Tabs defaultValue="single" className="w-fill">
        <TabsList className="w-full flex">
          <TabsTrigger value="single" className="flex-grow">
            Single
          </TabsTrigger>
          <TabsTrigger value="multiple" className="flex-grow">
            Multiple
          </TabsTrigger>
        </TabsList>
        <TabsContent value="single">
          {/* <TeacherForm subjects={subjects} /> */}
          <div>Teacher form goes</div>
        </TabsContent>
        <TabsContent value="multiple">
          <MultiTeachersUpload/>
        </TabsContent>
      </Tabs>
    </div>
  );
}
