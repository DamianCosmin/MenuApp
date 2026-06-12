import { useEffect, useState } from "react";

import { Order, PaymentData } from "../utils/types.ts";
import { BASE_URL, socket } from "../utils/routes.ts";
import GridMap from "../components/GridMap.tsx";
import SideOrder from "../components/SideOrder.tsx";
import { useAuthFetch } from "../utils/useAuthFetch.ts";

const tableMap = [
  [1, 2, 3, null, 4, 5, 6],
  [7, 8, 9, 10, 11, 12, 13],
  [null, 14, 15, 16, 17, 18, null],
  [null, 19, 20, 21, 22, 23, null],
];

function TablesPage () {
    const [tableID, setTableID] = useState<number | null>(null);
    const [bookedTables, setBookesTables] = useState<number[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const authFetch = useAuthFetch();

    const fetchBookedTables = async () => {
        const res = await authFetch(`${BASE_URL}/api/tables/indexes`);
        const data = await res.json();
        
        setBookesTables(data);
    }

    useEffect(() => {
        const fetchTableOrders = async (tableIndex: number | null) => {
            if (!tableIndex) return;

            const res = await authFetch(`${BASE_URL}/api/tables/${tableIndex}`);
            const data = await res.json();

            setOrders(data);
        }

        fetchBookedTables();

        if (tableID !== null) {
            fetchTableOrders(tableID);
        } else {
            setOrders([]);
        }

        const handleOrderConfirmed = ({updatedOrder, pendingId, indexes} : {updatedOrder: Order, pendingId: number, indexes: number[]}) => {
            setBookesTables(indexes);
            if (updatedOrder.tableID === tableID) {
                setOrders((prev) => {
                    return prev ? [...prev, updatedOrder] : [updatedOrder];
                });
            }
        };

        const handleOrderFinished = (finishedOrder: Order) => {
            if (finishedOrder.tableID === tableID) {
                setOrders((prev) => 
                    prev.map((ord) => {
                        return ord.id === finishedOrder.id ? finishedOrder : ord;
                    })
                );
            }
        };

        const handleNewPayment = (newPayment: PaymentData) => {
            setBookesTables(prev => prev.filter(tblId => tblId !== newPayment.tableID));

            if (newPayment.tableID === tableID) {
                setOrders((prev) => {
                    if (!prev) {
                        return [];
                    }

                    const paidOrdersIds = newPayment.orders.map(ord => ord.id);
                    const unpaidOrders = prev.filter(ord => !paidOrdersIds.includes(ord.id));
                    return unpaidOrders;
                })
            }
        };

        socket.on("orderConfirmed", handleOrderConfirmed);
        socket.on("orderFinished", handleOrderFinished);
        socket.on("newPayment", handleNewPayment);

        return () => {
            socket.off("orderConfirmed", handleOrderConfirmed);
            socket.off("orderFinished", handleOrderFinished);
            socket.off("newPayment", handleNewPayment);
        };
    }, [tableID]);

    return (
        <div className="tables-page">
            <div
            className="pt-4 pb-5 px-3 px-md-5 bg-dark rounded d-flex flex-column align-items-center"
            style={{ minWidth: '340px' }}
            >
                <h2 className="mb-4">TABLES</h2>
                <div className="tables-container">
                    <GridMap rows={tableMap.length} columns={tableMap[0].length} mapData={tableMap} 
                    bookedTablesID={bookedTables}
                    onSelect={(id) =>
                    id ? setTableID(id) : setTableID(null)
                    } />
                    <SideOrder tableId={tableID} tableOrders={tableID !== null ? (orders ? orders : null) : null} onClose={() => setTableID(null)} />
                </div>
            </div>
        </div>
    );
}

export default TablesPage;