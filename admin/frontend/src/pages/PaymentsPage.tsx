import { useState, useEffect } from "react";

import { BASE_URL, socket } from "../utils/routes.ts";
import PaymentCard from "../components/PaymentCard.tsx";
import { PaymentData } from "../utils/types.ts";

function PaymentsPage() {
    const [payments, setPayments] = useState<PaymentData[]>([]);
    const [showCompleted, setShowCompleted] = useState<boolean>(false);

    const toggleCompletedPayments = () => {
        setShowCompleted(!showCompleted);
    }

    return (
        <div className="orders-page">
            <div
            className="pt-4 px-3 px-md-5 bg-dark rounded d-flex flex-column align-items-center"
            style={{ width: '40vw', minWidth: '340px' }}
            >
                <h2 className="mb-4">PAYMENTS</h2>
                
                {payments && payments.length === 0 ? 
                    <p>No payments completed yet</p> : 
                    payments.map((pay) => {
                        if (pay.status !== 'Completed') {
                            return <PaymentCard key={pay.id} payData={pay}/>
                        } 
                        
                        return null;
                    })
                }   

                {showCompleted && payments && payments.some(pay => pay.status === 'Completed') &&
                    <div className="w-100">
                        <hr className="mt-0 mb-4 border-light opacity-50" />

                        {payments.map((pay) => {
                            if (pay.status === 'Completed') {
                                return <PaymentCard key={pay.id} payData={pay}/>
                            }

                            return null;
                        })}
                    </div>
                }
                
                {payments && payments.some(pay => pay.status === 'Completed') &&
                    <div className="my-4 d-flex flex-wrap justify-content-center gap-2 gap-md-4">
                        <button className="btn btn-lg btn-light rounded-pill px-5" type="button" onClick={toggleCompletedPayments} onMouseUp={(e) => e.currentTarget.blur()}>
                            {showCompleted ? "HIDE COMPLETED PAYMENTS" : "SHOW COMPLETED PAYMENTS"}
                        </button>
                    </div>
                }      
            </div>
        </div>
    );
}

export default PaymentsPage;