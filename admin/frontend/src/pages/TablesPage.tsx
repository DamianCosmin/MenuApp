import { useState } from "react";
import GridMap from "../components/GridMap.tsx";
import SideOrder from "../components/SideOrder.tsx";

const tableMap = [
  [1, 2, 3, null, 4, 5, 6],
  [7, 8, 9, 10, 11, 12, 13],
  [null, 14, 15, 16, 17, 18, null],
  [null, 19, 20, 21, 22, 23, null],
];

const testOrder = [
    {name: "Double Cheeseburger", quantity: 2},
    {name: "Pepsi", quantity: 3},
    {name: "Cheeseburger", quantity: 4},
    {name: "Sprite", quantity: 2},
    {name: "Pancakes", quantity: 1},
     {name: "Double Cheeseburger", quantity: 2},
    {name: "Pepsi", quantity: 3},
    {name: "Cheeseburger", quantity: 4},
    {name: "Sprite", quantity: 2},
    {name: "Pancakes", quantity: 1},
     {name: "Double Cheeseburger", quantity: 2},
    {name: "Pepsi", quantity: 3},
    {name: "Cheeseburger", quantity: 4},
    {name: "Sprite", quantity: 2},
    {name: "Pancakes", quantity: 1},
     {name: "Double Cheeseburger", quantity: 2},
    {name: "Pepsi", quantity: 3},
    {name: "Cheeseburger", quantity: 4},
    {name: "Sprite", quantity: 2},
    {name: "Pancakes", quantity: 1},
     {name: "Double Cheeseburger", quantity: 2},
    {name: "Pepsi", quantity: 3},
    {name: "Cheeseburger", quantity: 4},
    {name: "Sprite", quantity: 2},
    {name: "Pancakes", quantity: 1},
];

const testBookedTables = [
    {id: 3, order: testOrder},
    {id: 5, order: testOrder},
    {id: 8, order: testOrder},
    {id: 12, order: testOrder},
    {id: 13, order: testOrder},
    {id: 16, order: testOrder},
    {id: 20, order: testOrder},
];

function TablesPage () {
    const [tableID, setTableID] = useState<number | null>(null);

    const testBookedIndexes = testBookedTables.map(tbl => tbl.id);
    const selectedTable = testBookedTables.find(tbl => tbl.id === tableID);

    return (
        <div className="tables-page">
            <div
            className="pt-4 pb-5 px-3 px-md-5 bg-dark rounded d-flex flex-column align-items-center"
            style={{ minWidth: '340px' }}
            >
                <h2 className="mb-4">Tables</h2>
                <div className="tables-container">
                    <GridMap rows={tableMap.length} columns={tableMap[0].length} mapData={tableMap} 
                    bookedTablesID={testBookedIndexes}
                    onSelect={(id) =>
                    id ? setTableID(id) : setTableID(null)
                    } />
                    <SideOrder table={tableID !== null ? (selectedTable ? selectedTable : {id: tableID, order: null}) : null} onClose={() => setTableID(null)} />
                </div>
            </div>
        </div>
    );
}

export default TablesPage;