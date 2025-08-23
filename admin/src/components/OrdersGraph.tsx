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
  { name: "MON", Orders: 130 },
  { name: "TUE", Orders: 120 },
  { name: "WED", Orders: 150 },
  { name: "THU", Orders: 160 },
  { name: "FRI", Orders: 350 },
  { name: "SAT", Orders: 400 },
  { name: "SUN", Orders: 420 }
];

export default function OrdersGraph() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="Orders" stroke="gold" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
}