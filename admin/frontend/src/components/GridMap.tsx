import React from "react"
import TableIconButton from "./TableIconButton.tsx";

interface GridMapProps {
    rows: number;
    columns: number;
    mapData: (number | null)[][];
    bookedTablesID: number[];
    onSelect: (tbl: number | null) => void;
};

function GridMap({rows, columns, mapData, bookedTablesID, onSelect}: GridMapProps) {
    let tableIndex = 0;

    return (
        <div className="table-grid"
            style={{
                "--grid-rows": rows,
                "--grid-cols": columns,
            } as React.CSSProperties}
        >
            {mapData.flat().map((cell, index) => {
                if (!cell) return <div key={index} className="table-null" />

                tableIndex++;
                const currentIndex = tableIndex;
                
                return <TableIconButton key={index} id={currentIndex} 
                isBooked={bookedTablesID.some(tblID => tblID === currentIndex)} 
                onOpen={() => onSelect(currentIndex)} />
            })}
        </div>
    );
}

export default GridMap;