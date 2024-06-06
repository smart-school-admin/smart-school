/** component imports */
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileUpload from "@/components/general/fileUpload";
import SubmitButton from "@/components/general/forms/submitButton";

export default function AddStudentPage() {
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
        <TabsContent value="single">Upload Single Student</TabsContent>
        <TabsContent value="multiple">
          <form className="flex flex-col gap-4">
            <FileUpload />
            <SubmitButton className="py-4"/>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
