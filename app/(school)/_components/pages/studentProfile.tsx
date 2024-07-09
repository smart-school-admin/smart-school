"use client";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import ScoreCard from "../cards/scoreCard";
import { predictGrades } from "../../school_admin/_actions/student";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { ResponsiveContainer, Bar, BarChart, XAxis, YAxis } from "recharts";

type StudentProfileProps = {
  studentData: {
    id: string;
    first_name: string;
    last_name: string;
    other_names: string;
    year: number;
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

  studentData.course.subjects.forEach((subject) => {
    if (grades[subject.id]) {
      gradesExtended.push({
        ...grades[subject.id],
        math_intensive: subject.math_intensive,
        subjectId: subject.id,
      });
    }
  });

  // useEffect(() => {
  //   predictGrades(studentData.id, gradesExtended)
  //     .then((res) => {
  //       console.log("reiodf",res);
  //     })
  //     .catch((err) => {
  //       toast.error(err.errorMessage);
  //     });
  // }, []);

  const {
    data: response,
    error,
    refetch,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["grades_preds"],
    queryFn: async () => await predictGrades(studentData.id, gradesExtended),
  });

  if (error && error.message) toast.error(error.message);



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
          <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-8">
            <Card>
              <CardContent>
                <h2 className="text-center uppercase text-xl">GRADES</h2>
                <div className="flex flex-col gap-4">
                  {studentData.course.subjects.map((subject, index) => (
                    <ScoreCard
                      key={index}
                      subjectName={subject.name}
                      subjectCode={subject.code}
                      score={grades[subject.id]?.score}
                      predictedScore={
                        response?.success &&
                        response.success.predictions[subject.id]
                      }
                      passed={grades[subject.id]?.passed}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
            {response && response.success && response.success.explanations && (
              <ExplanationsPlot
                explanations={response.success.explanations}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ExplanationsPlot({
  explanations,
}: {
  explanations: [string, number][];
}) {
  const data = explanations.map((item) => ({ name: item[0], value: item[1] }));
  console.log(data)
  return (
    <ResponsiveContainer width="100%" height={700}>
      <BarChart data={data}>
        <XAxis dataKey="name"/>
        <YAxis dataKey="value"/>
        <Bar dataKey="value" />
      </BarChart>
    </ResponsiveContainer>
  );
}
