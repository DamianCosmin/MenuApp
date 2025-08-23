const defaultOrder = [
    {name: "Double Cheeseburger", quantity: 2},
    {name: "Pepsi", quantity: 3},
    {name: "Pancakes", quantity: 1},
];

const orders = [
    {index: 0, order: defaultOrder, status: "Pending"},
    {index: 1, order: defaultOrder, status: "Pending"},
    {index: 2, order: defaultOrder, status: "Pending"},
    {index: 3, order: defaultOrder, status: "Preparing"},
    {index: 4, order: defaultOrder, status: "Preparing"},
    {index: 5, order: defaultOrder, status: "Completed"},
    {index: 6, order: defaultOrder, status: "Completed"},
]

function OrdersPage() {
    return (
        <div className="orders-page">
            <div
            className="pt-4 px-3 px-md-5 bg-dark rounded d-flex flex-column align-items-center"
            style={{ width: '40vw', minWidth: '340px' }}
            >
                <h2 className="mb-4">Current Orders</h2>
                
                {orders.map((item, index) => (
                    <div key={index} className="bg-secondary bg-opacity-25 text-light w-100 rounded p-3 mb-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <h4 className="mb-1">Order No. {item.index + 1}</h4>
                            <p className="mb-0">Status: {item.status}</p>
                        </div>

                        <div className="ms-3">
                            {item.order.map((orderItem, orderIndex) => (
                                <p key={orderIndex} className="mb-0">
                                    {orderItem.quantity > 1 ? (orderItem.quantity + 'x ' + orderItem.name) : orderItem.name}
                                </p>
                            ))}
                        </div>

                        <div className="mt-3 d-flex flex-wrap justify-content-center gap-2 gap-md-4">
                            <button className="btn btn-lg btn-success rounded-pill px-3" type="button" onMouseUp={(e) => e.currentTarget.blur()}>CONFIRM</button>
                            <button className="btn btn-lg btn-danger rounded-pill px-3" type="button" onMouseUp={(e) => e.currentTarget.blur()}>DECLINE</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OrdersPage;