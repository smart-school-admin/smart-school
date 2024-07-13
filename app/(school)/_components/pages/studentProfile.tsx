"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { predictGrades } from "../../school_admin/_actions/student";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { MailIcon, PhoneCallIcon } from "lucide-react";

import { Drawer, DrawerTrigger } from "@/components/ui/drawer";
import StatsDrawerContent from "./_components/statsDrawerContent";

type StudentProfileProps = {
  studentData: {
    id: string;
    first_name: string;
    last_name: string;
    other_names: string;
    year: number;
    imagePath: string | null;
    phone_number: string | null;
    index_number: number;
    email: string | null;
    course: {
      name: string;
      code: string;
      subjects: {
        id: number;
        code: string;
        name: string;
        math_intensive: boolean;
      }[];
    };
  };
  grades: {
    [key: string]: { score: number; passed: boolean; semester: number };
  };
};

export default function StudentProfile({
  studentData,
  grades,
}: StudentProfileProps) {
  const gradesExtended: {
    subjectId: number;
    score: number;
    passed: boolean;
    math_intensive: boolean;
  }[] = [];

  let avgScore = 0;
  studentData.course.subjects.forEach((subject) => {
    if (grades[subject.id]) {
      gradesExtended.push({
        ...grades[subject.id],
        math_intensive: subject.math_intensive,
        subjectId: subject.id,
      });
      avgScore += grades[subject.id].score;
    }
  });

  avgScore/=gradesExtended.length;

  const {
    data: predictionsResponse,
    error,
    refetch,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["grades_preds"],
    queryFn: async () => await predictGrades(studentData.id, gradesExtended),
    refetchOnWindowFocus: false,
  });

  let predictedAvg = 0;

  if(predictionsResponse?.success){
    for(let key of Object.keys(predictionsResponse?.success?.predictions)){
      predictedAvg+=predictionsResponse?.success?.predictions[key]
    }
  }
  predictedAvg/=gradesExtended.length;

  if (error && error.message) toast.error(error.message);

  return (
    <div className="flex items-center gap-32 justify-center h-screen">
      <div className="flex flex-col justify-center items-center">
        <div className="flex justify-center items-center flex-col">
          <div className="text-center">{studentData?.index_number}</div>
          <Avatar className="w-52 h-52 my-6">
            <AvatarImage src={studentData?.imagePath ?? ""} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-center">
              {studentData!.first_name} {studentData!.last_name}
            </h2>
            <div className="text-ssGray-200 text-sm text-center">
              {studentData!.course.code}-{studentData!.course.name}
            </div>
          </div>
        </div>
        {/** Icons */}
        <div className="flex justify-center gap-4 mt-8">
          <Link href={`tel:${studentData!.phone_number}`}>
            <PhoneCallIcon className="w-6 h-6 stroke-ssGray-300" />
          </Link>
          <Link href={`mailto:${studentData!.email}`}>
            <MailIcon className="w-6 h-6 stroke-ssGray-300" />
          </Link>
        </div>
        {/** Icons */}
      </div>
      {/** Stats start */}
      <div className="flex flex-col justify-center gap-8">
        <div>
          <h3 className="text-2xl text-ssGray-300">SUMMARY</h3>
          <div className="flex gap-12">
            <div>
              <div>
                <span className="text-ssGray-200 text-sm">Average</span>

                <div className="text-5xl text-green-700 ">{avgScore.toFixed(2)}</div>
              </div>
            </div>
            <div>
              <div>
                <span className="text-ssGray-200 text-sm">
                  Predicted Average
                </span>
                <Drawer>
                  <DrawerTrigger asChild>
                    <div className="text-5xl text-purple-700 cursor-pointer">
                      {isLoading && "?"}
                      {!isLoading && predictedAvg.toFixed(2)}
                    </div>
                  </DrawerTrigger>
                  <StatsDrawerContent
                    predictionsData={predictionsResponse?.success}
                    grades={grades}
                    subjects={studentData.course.subjects}
                  />
                </Drawer>
              </div>
            </div>
            <div>
              <span className="text-ssGray-200 text-sm">Abscences</span>
              <div className="text-5xl text-blue-700">21/38</div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-2xl text-ssGray-300">LIVE UPDATES</h3>
          <div className="flex gap-12">
            <div>
              <span className="text-ssGray-200 text-sm">Average</span>
              <div className="text-5xl text-ssPrimary-100">78.12</div>
            </div>
            <div>
              <span className="text-ssGray-200 text-sm">Average</span>
              <div className="text-5xl text-ssPrimary-100">78.12</div>
            </div>
          </div>
        </div>
      </div>
      {/** Stats end */}
    </div>
  );
}
