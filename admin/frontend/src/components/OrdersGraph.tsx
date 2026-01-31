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
import { OrdersGraphData } from "../utils/types";

type OrdersGraphProps = {
    data: OrdersGraphData[];
}

export default function OrdersGraph({data}: OrdersGraphProps) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid stroke="#ccc" strokeDasharray="1 5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip contentStyle={{
                    backgroundColor: "#212529",
                    borderRadius: "5px", 
                    border: "1px solid gold",
                    color: "#fff"
                }}/>
                <Legend />
                <Line type="monotone" dataKey="orders" stroke="gold" strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
    );
}