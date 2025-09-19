interface ButtonProps {
    id: number; 
    isBooked: boolean;
    onOpen: (id: number | null) => void;
}

function TableIconButton({id, isBooked, onOpen}: ButtonProps) {
    const handleTableClick = (id: number, onOpen: (id: number) => void) => {
        const mobileBreakpoint = 1280;

        if (window.innerWidth <= mobileBreakpoint) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        onOpen(id);
    };

    return (
        <div>
            <button className={"table-button " + (isBooked ? "booked" : "")} onClick={() => handleTableClick(id, onOpen)}>
                <h3 className="mb-0">T{id}</h3>
                <img src="/table_icon.png" alt="Table Icon" />            
            </button>
        </div>
    );
}

export default TableIconButton;