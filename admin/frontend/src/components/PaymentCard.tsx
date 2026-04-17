import { PaymentData } from "../utils/types.ts";
import { BASE_URL } from "../utils/routes.ts";
import { mergeOrderItems } from "../components/SideOrder.tsx";

type PaymentProps = {
    payData: PaymentData,
}

function PaymentCard({payData}: PaymentProps) {
    
    return (
        <div key={payData.id} className="bg-secondary bg-opacity-25 text-light w-100 rounded p-3 mb-4">
            <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-1">Table No. {payData.tableID}</h4>
                <p className="mb-0">Status: {payData.status}</p>
            </div>

            <div className="ms-3">
                <p className="mb-0">
                    Payment method: {payData.method}
                </p>
                <p className="mb-0">
                    Total: {payData.totalAmount.toFixed(2)}
                </p>
                <p className="mb-0">
                    Overview:
                </p>
                {mergeOrderItems(payData.orders).map((orderItem, orderIndex) => (
                    <p key={orderIndex} className="mb-0 ms-1">
                        {orderItem.quantity > 1 ? (orderItem.quantity + 'x ' + orderItem.item.itemName) : orderItem.item.itemName}
                    </p>
                ))}
            </div>
            
            {payData.status === 'Pending' && 
                <div className="mt-3 d-flex flex-wrap justify-content-center gap-2 gap-md-4">
                    <button className="btn btn-lg btn-success rounded-pill px-5" type="button" onClick={() => {}} onMouseUp={(e) => e.currentTarget.blur()}>COMPLETE</button>
                </div>
            }
        </div>
    );
}

export default PaymentCard;