import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ProgramElement } from "../../types";

interface ChartSelectedProps {
  programElements: ProgramElement[];
}

function uniqueColorHexFromPIDString(pid: string) {
  var hash = 0;
  for (var i = 0; i < pid.length; i++) {
    hash = pid.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = "#";
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).substr(-2);
  }
  return colour;
}

const ChartSelected: React.FC<ChartSelectedProps> = ({ programElements }) => {
  // sum of program elements should be x axis
  // fy 2022 - fy 2028 should be y axis

  // create data where each element has entries for all program elements of that year
  const years = [
    "fy_2022",
    "fy_2023",
    "fy_2024",
    "fy_2025",
    "fy_2026",
    "fy_2027",
    "fy_2028",
  ];

  const data = years.map((year) => {
    const yearData = {
      name: year,
    };

    programElements.forEach((programElement) => {
      yearData[programElement.pid] = programElement[year];
    });

    return yearData;
  });

  console.log("data");
  console.log(data);
  // console.log(programElements);

  return (
    <AreaChart
      width={500}
      height={400}
      data={data}
      margin={{
        top: 10,
        right: 30,
        left: 0,
        bottom: 0,
      }}
      style={{ background: "white" }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      {/* <Tooltip /> */}
      {/* <Legend /> */}
      {programElements.map((programElement) => (
        <Area
          type="monotone"
          dataKey={programElement.pid}
          stackId="1"
          stroke="#8884d8"
          fill={uniqueColorHexFromPIDString(programElement.pid)}
        />
      ))}
    </AreaChart>
  );
};

export default ChartSelected;
