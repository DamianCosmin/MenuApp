import { useState, useEffect } from "react";

import { BASE_URL, socket } from "../utils/routes.ts";
import OrderCard from "../components/OrderCard.tsx";
import { Order, PaymentData } from "../utils/types.ts";

function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [showFinished, setShowFinished] = useState<boolean>(false);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${BASE_URL}/api/orders`);
            const data: Order[] = await res.json();
            setOrders(data);
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
    }

    const toggleFinishedOrders = () => {
        setShowFinished(!showFinished);
    }

    const handleNewOrder = (order: Order) => {
        setOrders(prev => prev ? [order, ...prev] : [order]);
    }

    const handleOrderConfirmed = ({updatedOrder, pendingId, _}: {updatedOrder: Order, pendingId: number, _: number[]}) => {
        setOrders(prev => {
            if (!prev) {
                return [];
            }

            const otherOrders = prev.filter(o => !(o.id === pendingId && o.status === 'Pending'));

            return [...otherOrders, updatedOrder];
        });
    }

    const handleOrderDeleted = (deletedOrder: Order) => {
        setOrders(prev => prev ? prev.filter(o => !(o.id === deletedOrder.id && o.status === 'Pending')) : []);
    }

    const handleOrderFinished = (finishedOrder: Order) => {
        setOrders(prev => {
            if (!prev) {
                return [];
            }

            const otherOrders = prev.filter(o => !(o.id === finishedOrder.id && o.status === 'Confirmed'));

            return [...otherOrders, finishedOrder];
        })
    }

    const handleNewPayment = (newPayment: PaymentData) => {
        setOrders(prev => {
            if (!prev) {
                return [];
            }

            const paidOrdersIds = newPayment.orders.map(ord => ord.id);
            const unpaidOrders = prev.filter(ord => !paidOrdersIds.includes(ord.id));
            return unpaidOrders;
        })
    }

    useEffect(() => {
        fetchOrders();

        socket.on("newOrder", handleNewOrder);
        socket.on("orderConfirmed", handleOrderConfirmed);
        socket.on("orderDeleted", handleOrderDeleted);
        socket.on("orderFinished", handleOrderFinished);
        socket.on("newPayment", handleNewPayment)

        return () => {
            socket.off("newOrder", handleNewOrder);
            socket.off("orderConfirmed", handleOrderConfirmed);
            socket.off("orderDeleted", handleOrderDeleted);
            socket.off("orderFinished", handleOrderFinished);
            socket.off("newPayment", handleNewPayment);
        };
    }, []);

    return (
        <div className="orders-page">
            <div
            className="pt-4 px-3 px-md-5 bg-dark rounded d-flex flex-column align-items-center"
            style={{ width: '40vw', minWidth: '340px' }}
            >
                <h2 className="mb-4">CURRENT ORDERS</h2>
                
                {orders && orders.length === 0 ? 
                    <p>No orders yet</p> : 
                    orders.map((ord) => {
                        if (ord.status !== 'Finished') {
                            return <OrderCard key={`${ord.id}-${ord.status}`} order={ord}/>
                        } 
                        
                        return null;
                    })
                }   

                {showFinished && orders && orders.some(ord => ord.status === 'Finished') &&
                    <div className="w-100">
                        <hr className="mt-0 mb-4 border-light opacity-50" />

                        {orders.map((ord) => {
                            if (ord.status === 'Finished') {
                                return <OrderCard key={`${ord.id}-${ord.status}`} order={ord}/>
                            }

                            return null;
                        })}
                    </div>
                }
                
                {orders && orders.some(ord => ord.status === 'Finished') &&
                    <div className="my-4 d-flex flex-wrap justify-content-center gap-2 gap-md-4">
                        <button className="btn btn-lg btn-light rounded-pill px-5" type="button" onClick={toggleFinishedOrders} onMouseUp={(e) => e.currentTarget.blur()}>
                            {showFinished ? "HIDE FINISHED ORDERS" : "SHOW FINISHED ORDERS"}
                        </button>
                    </div>
                }      
            </div>
        </div>
    );
}

export default OrdersPage;