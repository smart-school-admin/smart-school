import { ResponsiveContainer, Bar, BarChart, XAxis, YAxis } from "recharts";
import { ML_API } from "@/lib/constants";

export default function ExplanationsPlot({
  explanations,
}: {
  explanations: [string, number][];
}) {
  // console.log(explanations)
  const data = explanations.map((item) => ({
    // name: item[0].split(" ")[0].split("__")[1],
    name: item[0].match(ML_API.EXPLANATIONS_REG)![1],
    value: Math.abs(item[1]),
    fill: item[1] < 0 ? "#D90000" : "#0c7ef0",
  }));


  return (
    <ResponsiveContainer width={600} height={400}>
      <BarChart data={data} layout="vertical" barSize={25}>
        <XAxis dataKey="value" type="number" />
        <YAxis dataKey="name" type="category" fontSize={12} width={200} />
        <Bar dataKey="value" layout="vertical" />

      </BarChart>
    </ResponsiveContainer>
  );
}
