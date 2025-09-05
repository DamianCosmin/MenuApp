import React, {useState} from "react"
import TableIconButton from "./TableIconButton.tsx";

interface GridMapProps {
    rows: number;
    columns: number;
    mapData: (boolean | null)[][];
};

function GridMap({rows, columns, mapData}: GridMapProps) {
    let tableIndex = 0;

    const [openId, setOpenId] = useState<number | null>(null);

    const handleOpen = (id: number) => {
        setOpenId(id);
    };

    const handleClose = () => {
        setOpenId(null);
    };

    return (
        <div className="table-grid"
            style={{
                "--grid-rows": rows,
                "--grid-cols": columns,
            } as React.CSSProperties}
        >
            {mapData.flat().map((cell, index) => {
                if (!cell) return <div key={index} className="cell table-null" />
                
                tableIndex++;
                return <TableIconButton key={index} isBooked={tableIndex % 5 === 0} id={tableIndex} isOpen={openId === tableIndex} onOpen={handleOpen} onClose={handleClose}/>
            })}
        </div>
    );
}

export default GridMap;