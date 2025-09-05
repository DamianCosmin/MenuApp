interface OrderItem {
    name: string,
    quantity: number,
}

interface Order {
    id: number,
    status: string,
    items: OrderItem[],
}

type OrderProps = {
    order: Order,
}

function OrderCard({order}: OrderProps) {
    const confirmOrder = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/orders/${order.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newStatus: "Confirmed" }),
            });

            const data = await response.json();
            console.log("Order confirmed:", data);

        } catch (error) {
            console.error("Failed to confirm order!",  error);
        }
    };

    const deleteOrder = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/orders/${order.id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            const data = await response.json();
            console.log("Order deleted:", data);

        } catch (error) {
            console.error("Failed to delete order!", error);
        }
    };

    return (
        <div key={order.id} className="bg-secondary bg-opacity-25 text-light w-100 rounded p-3 mb-4">
            <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-1">Order No. {order.id}</h4>
                <p className="mb-0">Status: {order.status}</p>
            </div>

            <div className="ms-3">
                {order.items.map((orderItem, orderIndex) => (
                    <p key={orderIndex} className="mb-0">
                        {orderItem.quantity > 1 ? (orderItem.quantity + 'x ' + orderItem.name) : orderItem.name}
                    </p>
                ))}
            </div>
            
            {order.status === 'Pending' && 
                <div className="mt-3 d-flex flex-wrap justify-content-center gap-2 gap-md-4">
                    <button className="btn btn-lg btn-success rounded-pill px-3" type="button" onClick={confirmOrder} onMouseUp={(e) => e.currentTarget.blur()}>CONFIRM</button>
                    <button className="btn btn-lg btn-danger rounded-pill px-3" type="button" onClick={deleteOrder} onMouseUp={(e) => e.currentTarget.blur()}>DECLINE</button>
                </div>
            }
        </div>
    );
}

export default OrderCard;