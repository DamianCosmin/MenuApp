import { useState, useEffect } from "react";

import { BASE_URL, socket } from "../utils/routes.ts";
import OrderCard from "../components/OrderCard.tsx";
import { Order } from "../utils/types.ts";

function OrdersPage() {
    const [orders, setOrders] = useState<Order[] | null>(null);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/orders`);
            const data: Order[] = await res.json();
            setOrders(data);
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
    }

    useEffect(() => {
        fetchOrders();

        socket.on("newOrder", (order) => {
            setOrders(prev => prev ? [order, ...prev] : [order]);
        });

        socket.on("orderConfirmed", ({updatedOrder, pendingId, _}) => {
            setOrders(prev => {
                if (!prev) {
                    return [];
                }

                const otherOrders = prev.filter(o => o.id !== pendingId);

                return [...otherOrders, updatedOrder];
            });
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
                    (orders.map((ord) => <OrderCard key={`${ord.id}-${ord.status}`} order={ord}/>))
                }
            </div>
        </div>
    );
}

export default OrdersPage;