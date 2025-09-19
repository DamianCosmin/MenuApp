import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { TableItem } from './Models.tsx';

interface SideOrderProps {
    table: TableItem | null;
    onClose: () => void;
}

function SideOrder ({table, onClose} : SideOrderProps) {
    if (!table) return null;

    return (
        <div className="side-order">
            <FontAwesomeIcon icon={faXmark} className="side-order-icon" onClick={onClose}/>
            <h4 className="text-center mt-1">Table {table.id}</h4>
            {table.order == null ? 
                <p>Empty table</p> : 
                <div>
                    {table.order.map((item, index) => (
                        <p key={index} className="mb-0">
                            {item.quantity > 1 ? (item.quantity + 'x ' + item.name) : item.name}
                        </p>
                    ))}
                </div>
            }
        </div>
    );
}

export default SideOrder;