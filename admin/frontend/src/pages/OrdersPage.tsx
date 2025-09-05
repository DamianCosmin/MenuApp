import { useState, useEffect } from "react";
import OrderCard from "../components/OrderCard.tsx";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

interface OrderItem {
    name: string,
    quantity: number,
}

interface Order {
    id: number,
    status: string,
    items: OrderItem[],
}

function OrdersPage() {
    const [orders, setOrders] = useState<Order[] | null>(null);

    const fetchOrders = async () => {
        await fetch("http://localhost:5000/api/orders")
        .then((res) => res.json())
        .then((data: Order[]) => setOrders(data))
        .catch((err) => console.error(err));
    }

    useEffect(() => {
        fetchOrders();

        socket.on("newOrder", (order) => {
            setOrders(prev => prev ? [...prev, order] : [order]);
        });

        socket.on("orderConfirmed", (updatedOrder) => {
            setOrders(prev =>
            prev ? prev.map(o => (o.id === updatedOrder.id ? updatedOrder : o)) : []
            );
        });

        socket.on("orderDeleted", (deletedOrder) => {
            setOrders(prev => prev ? prev.filter(o => o.id !== deletedOrder.id) : []);
        });

        return () => {
            socket.off("newOrder");
            socket.off("orderConfirmed");
            socket.off("orderDeleted");
        };
    }, []);

    return (
        <div className="orders-page">
            <div
            className="pt-4 px-3 px-md-5 bg-dark rounded d-flex flex-column align-items-center"
            style={{ width: '40vw', minWidth: '340px' }}
            >
                <h2 className="mb-4">Current Orders</h2>
                
                { orders === null ? null : orders.length === 0 ? 
                    (<p>No orders yet</p>) : 
                    (orders.map((ord) => <OrderCard key={ord.id} order={ord}/>))
                }
            </div>
        </div>
    );
}

export default OrdersPage;