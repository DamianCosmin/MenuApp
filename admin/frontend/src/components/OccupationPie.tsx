import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Occupation Rate", value: 65 },
  { name: "Remaining", value: 35 },
];

const COLORS = ["#ffa600", "#333"];

export default function HalfPieChart() {
  const percentage = data[0].value;

  return (
    <div style={{ position: "relative", width: "100%", height: 120 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"         // center X
            cy="100%"        // push center down so only half is visible
            startAngle={180} // start from left
            endAngle={0}     // end at right
            innerRadius={60} // makes it a donut
            outerRadius={100}
            // paddingAngle={0}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, 40%)",
            fontSize: "26px",
            fontWeight: "bold",
            color: "#fff",
            pointerEvents: "none",
          }}
        >
          {percentage}%
        </div>
    </div>
  );
}