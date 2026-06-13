import { PaymentData } from "../utils/types.ts";
import { BASE_URL } from "../utils/routes.ts";
import { mergeOrderItems } from "../components/SideOrder.tsx";
import { useAuthFetch } from "../utils/useAuthFetch.ts";

type PaymentProps = {
    payData: PaymentData,
}

function PaymentCard({payData}: PaymentProps) {
    const authFetch = useAuthFetch()
    
    const completePayment = async () => {
        try {
            const response = await authFetch(`${BASE_URL}/api/payments/${payData.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newStatus: "Completed" }),
            });

            const data = await response.json();
            console.log("Payment completed:", data);
        } catch (error) {
            console.error("Failed to complete payment!",  error);
        }
    }

    return (
        <div key={payData.id} className="bg-secondary bg-opacity-25 text-light w-100 rounded p-3 mb-4">
            <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-1">Payment No. {payData.id}</h4>
                <p className="mb-0">Status: <b>{payData.status}</b></p>
            </div>

            <div className="ms-3">
                <p className="mb-0">
                    Table: <b>{payData.tableID}</b>
                </p>
                <p className="mb-0">
                    Payment method: <b>{payData.method}</b>
                </p>
                <p className="mb-0">
                    Total: <b>{payData.totalAmount.toFixed(2)} RON</b>
                </p>
                <p className="mb-2">
                    Tips: <b>{payData.totalTips.toFixed(2)} RON</b>
                </p>
                <p className="mb-0">
                    Overview:
                </p>
                {mergeOrderItems(payData.orders).map((orderItem, orderIndex) => (
                    <p key={orderIndex} className="mb-0 ms-3">
                        {orderItem.quantity > 1 ? (orderItem.quantity + 'x ' + orderItem.item.itemName) : orderItem.item.itemName}
                    </p>
                ))}
            </div>
            
            {payData.status === 'Pending' && 
                <div className="mt-3 d-flex flex-wrap justify-content-center gap-2 gap-md-4">
                    <button className="btn btn-lg btn-success rounded-pill px-5" type="button" onClick={completePayment} onMouseUp={(e) => e.currentTarget.blur()}>COMPLETE</button>
                </div>
            }
        </div>
    );
}

export default PaymentCard;