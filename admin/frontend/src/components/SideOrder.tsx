import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { OrderItem, Order, equalItems } from '../utils/types.ts';
import { useState } from 'react';

interface SideOrderProps {
    tableId: number | null;
    tableOrders: Order[] | null;
    onClose: () => void;
}

function SideOrder ({tableId, tableOrders, onClose} : SideOrderProps) {
    const [showMerged, setShowMerged] = useState<boolean>(false);

    const toggleMerged = () => {
        setShowMerged(!showMerged);
    }

    const mergeOrderItems = (orders: Order[]): OrderItem[] => {
            const allItems: OrderItem[] = orders.flatMap((order: Order) => 
                order.items.map((ordItem: OrderItem) => ({item: ordItem.item, quantity: ordItem.quantity})));

            const merged: OrderItem[] = [];
    
            for (let ordItem of allItems) {
                let existingItem = merged.find((oi) => equalItems(oi.item, ordItem.item));
    
                if (existingItem) {
                    existingItem.quantity += ordItem.quantity;
                } else {
                    merged.push({...ordItem});
                }
            }
    
            return merged;
        }

    if (!tableOrders) return null;

    return (
        <div className="side-order">
            <FontAwesomeIcon icon={faXmark} className="side-order-icon" onClick={onClose}/>
            <h4 className="text-center mt-1">Table {tableId}</h4>

            {tableOrders.length === 0 ?
                <p>Empty table</p> : 
                <div className="d-flex flex-column h-100">
                    {showMerged ? 
                        <div>
                            {mergeOrderItems(tableOrders).map((ordItem, index) => (
                                <p key={index} className="mb-0">
                                    {ordItem.quantity > 1 ? (ordItem.quantity + 'x ' + ordItem.item.itemName) : ordItem.item.itemName}
                                </p>
                            ))}
                        </div> :
                        <div >
                            {tableOrders.map((ord) => (
                                <div key={ord.id} className={`mb-3 text-${ord.status === 'Finished' ? "success" : "dark"}`}>
                                    <h6 className="mb-1">Order #{ord.id}</h6>
                                    <hr className="mt-0 mb-0 border-dark opacity-50" />
                                    
                                    <ul>
                                        {ord.items.map((ordItem) => (
                                            <li key={`${ord.id}-${ordItem.item.categoryID}-${ordItem.item.itemID}`} className="mb-0">
                                                {ordItem.quantity > 1 ? (ordItem.quantity + 'x ' + ordItem.item.itemName) : ordItem.item.itemName}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    }
                    
                    <div className="d-flex flex-wrap justify-content-center gap-2 gap-md-4 mt-auto">
                        <button className="btn btn-lg btn-dark rounded-3 px-4 fs-6 mt-3" type="button" onClick={toggleMerged} onMouseUp={(e) => e.currentTarget.blur()}>
                            {showMerged ? "SHOW ORDERS" : "TOGGLE MERGED"}
                        </button>
                    </div>
                </div>
            }
        </div>
    );
}

export default SideOrder;