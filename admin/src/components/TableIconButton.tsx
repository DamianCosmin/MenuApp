import { useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faXmark} from "@fortawesome/free-solid-svg-icons";

interface ButtonProps {
    id: number;
    isBooked: boolean;
    isOpen: boolean;
    onOpen: (id: number) => void;
    onClose: () => void;
}

const testOrder = [
    {name: "Double Cheeseburger", quantity: 2},
    {name: "Pepsi", quantity: 3},
    {name: "Cheeseburger", quantity: 4},
    {name: "Sprite", quantity: 2},
    {name: "Pancakes", quantity: 1},
];

function TableIconButton({id, isBooked, isOpen, onOpen, onClose}: ButtonProps) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
            onClose();
        }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    return (
        <div ref={wrapperRef}>
            <button className={"table-button " + (isBooked ? "booked" : "")} onClick={() => onOpen(id)}>
                <h3 className="mb-0">T{id}</h3>
                <img src="/table_icon.png" alt="Table Icon" />            
            </button>

            {isOpen && (
                <div className="table-order">
                    <FontAwesomeIcon icon={faXmark} className="table-order-button" onClick={onClose} />
                    <h4 className="text-center mt-3">Table {id}</h4>
                    {testOrder.map((item, index) => (
                        <p key={index} className="mb-0">
                            {item.quantity > 1 ? (item.quantity + 'x ' + item.name) : item.name}
                        </p>
                    ))}
                </div>
            )}
        </div>
    );
}

export default TableIconButton;