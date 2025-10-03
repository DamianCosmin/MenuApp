import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { OrderItem } from '../utils/types.ts';

interface SideOrderProps {
    tableId: number | null;
    allItems: OrderItem[] | null;
    onClose: () => void;
}

function SideOrder ({tableId, allItems, onClose} : SideOrderProps) {
    if (!allItems) return null;

    return (
        <div className="side-order">
            <FontAwesomeIcon icon={faXmark} className="side-order-icon" onClick={onClose}/>
            <h4 className="text-center mt-1">Table {tableId}</h4>
            {allItems.length === 0 ? 
                <p>Empty table</p> : 
                <div>
                    {allItems.map((ordItem, index) => (
                        <p key={index} className="mb-0">
                            {ordItem.quantity > 1 ? (ordItem.quantity + 'x ' + ordItem.item.itemName) : ordItem.item.itemName}
                        </p>
                    ))}
                </div>
            }
        </div>
    );
}

export default SideOrder;