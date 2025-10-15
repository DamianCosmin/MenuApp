import { useEffect, useState } from "react";

import { equalItems, Order, OrderItem } from "../utils/types.ts";
import { BASE_URL, socket } from "../utils/routes.ts";
import GridMap from "../components/GridMap.tsx";
import SideOrder from "../components/SideOrder.tsx";

const tableMap = [
  [1, 2, 3, null, 4, 5, 6],
  [7, 8, 9, 10, 11, 12, 13],
  [null, 14, 15, 16, 17, 18, null],
  [null, 19, 20, 21, 22, 23, null],
];

function TablesPage () {
    const [tableID, setTableID] = useState<number | null>(null);
    const [bookedTables, setBookesTables] = useState<number[]>([]);
    const [order, setOrder] = useState<OrderItem[]>([]);

    const mergeOrderItems = (allItems: OrderItem[]): OrderItem[] => {
        const merged: OrderItem[] = [];

        for (var ordItem of allItems) {
            var existingItem = merged.find((oi) => equalItems(oi.item, ordItem.item));

            if (existingItem) {
                existingItem.quantity += ordItem.quantity;
            } else {
                merged.push({...ordItem});
            }
        }

        return merged;
    }

    const fetchBookedTables = async () => {
        const res = await fetch(`${BASE_URL}/api/tables/indexes`);
        const data = await res.json();
        
        setBookesTables(data);
    }

    const fetchTableOrders = async (tableIndex: number | null) => {
        if (!tableIndex) return;

        const res = await fetch(`${BASE_URL}/api/tables/${tableIndex}`);
        const data = await res.json();
        
        const allItems: OrderItem[] = data.flatMap((order: Order) => 
            order.items.map((ordItem: OrderItem) => ({item: ordItem.item, quantity: ordItem.quantity})));

        const mergedItems = mergeOrderItems(allItems);

        setOrder(mergedItems);
    }

    useEffect(() => {
        fetchBookedTables();
        
        socket.on("orderConfirmed", ({updatedOrder, indexes}) => {
            setOrder((prev) => {
                const allItems = prev ? [...prev, ...updatedOrder.items] : [...updatedOrder.items];
                const mergedItems = mergeOrderItems(allItems);
                return mergedItems;
            });
            setBookesTables(indexes);
        });

        return () => {
            socket.off("orderConfirmed");
        };
    }, []);

    useEffect(() => {fetchTableOrders(tableID);}, [tableID])

    return (
        <div className="tables-page">
            <div
            className="pt-4 pb-5 px-3 px-md-5 bg-dark rounded d-flex flex-column align-items-center"
            style={{ minWidth: '340px' }}
            >
                <h2 className="mb-4">Tables</h2>
                <div className="tables-container">
                    <GridMap rows={tableMap.length} columns={tableMap[0].length} mapData={tableMap} 
                    bookedTablesID={bookedTables}
                    onSelect={(id) =>
                    id ? setTableID(id) : setTableID(null)
                    } />
                    <SideOrder tableId={tableID} allItems={tableID !== null ? (order ? order : null) : null} onClose={() => setTableID(null)} />
                </div>
            </div>
        </div>
    );
}

export default TablesPage;