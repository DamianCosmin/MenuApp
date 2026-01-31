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
import { RevenueGraphData } from "../utils/types";

type RevenueGraphProps = {
    data: RevenueGraphData[];
}

export default function RevenueGraph({data}: RevenueGraphProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid stroke="#ccc" strokeDasharray="1 5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip contentStyle={{
                    backgroundColor: "#212529",
                    borderRadius: "5px", 
                    border: "1px solid #ffa500",
                    color: "#fff"
                }}/>
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#ffa500" strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
    );
}