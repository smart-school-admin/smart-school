import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AddStudentPage() {
  return (
    <div className="w-full max-w-3xl">
      <Tabs defaultValue="single" className="w-fill">
        <TabsList className="w-full flex">
          <TabsTrigger value="single" className="flex-grow">Single</TabsTrigger>
          <TabsTrigger value="multiple" className="flex-grow">Multiple</TabsTrigger>
        </TabsList>
        <TabsContent value="single">
          Upload Single Student
        </TabsContent>
        <TabsContent value="multiple">Upload from file</TabsContent>
      </Tabs>
    </div>
  );
}
