import GridMap from "../components/GridMap.tsx";

const tableMap = [
    [true, true, true, null, true, true, true],
    [true, true, true, true, true, true, true],
    [null, true, true, true, true, true, null],
    [null, true, true, true, true, true, null],
]

function TablesPage () {
    return (
        <div className="tables-page">
            <div
            className="pt-4 pb-5 px-3 px-md-5 bg-dark rounded d-flex flex-column align-items-center"
            style={{ minWidth: '340px' }}
            >
                <h2 className="mb-4">Tables</h2>
                <GridMap rows={4} columns={7} mapData={tableMap} />
            </div>
        </div>
    );
}

export default TablesPage;