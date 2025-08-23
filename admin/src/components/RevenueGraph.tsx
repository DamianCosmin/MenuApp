import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const data = [
  { name: "MON", Revenue: 3000 },
  { name: "TUE", Revenue: 2800 },
  { name: "WED", Revenue: 3400 },
  { name: "THU", Revenue: 2900 },
  { name: "FRI", Revenue: 6500 },
  { name: "SAT", Revenue: 7600 },
  { name: "SUN", Revenue: 7000 }
];

export default function RevenueGraph() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Revenue" stroke="#ffa500" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}