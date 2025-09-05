import OrdersGraph from '../components/OrdersGraph.tsx'
import RevenueGraph from '../components/RevenueGraph.tsx';
import OccupationPie from '../components/OccupationPie.tsx';

const topSellers = [
  "Double Cheeseburger",
  "Pizza Capriciosa",
  "Spaghetti Carbonara",
];

function AnalyticsPage() {
    return (
        <div className="analytics-page">
            <div className="container text-light">
                <div className="d-flex flex-row flex-wrap justify-content-center mb-4">
                    <label>
                        <input type='checkbox' id='analytic' className='analytics-tag' defaultChecked/>
                        <span>ALL</span>
                    </label>

                    <label>
                        <input type='checkbox' id='analytic' className='analytics-tag' />
                        <span>BURGERS</span>
                    </label>

                    <label>
                        <input type='checkbox' id='analytic' className='analytics-tag' />
                        <span>PIZZA</span>
                    </label>

                    <label>
                        <input type='checkbox' id='analytic' className='analytics-tag' />
                        <span>PASTA</span>
                    </label>

                    <label>
                        <input type='checkbox' id='analytic' className='analytics-tag' />
                        <span>COFFEE</span>
                    </label>

                    <label>
                        <input type='checkbox' id='analytic' className='analytics-tag' />
                        <span>SOFT DRINKS</span>
                    </label>

                    <label>
                        <input type='checkbox' id='analytic' className='analytics-tag' />
                        <span>WINES</span>
                    </label>

                    <label>
                        <input type='checkbox' id='analytic' className='analytics-tag' />
                        <span>DESSERTS</span>
                    </label>
                </div>

                <div className="row g-4 mb-4">
                    <div className="col-11 mx-auto col-md">
                        <div className="p-3 bg-dark rounded shadow-sm analytics-item">
                            <p className="fs-5 fw-normal">Total orders</p>
                            <p className="fs-1 fw-bold mb-1 text-orders">70</p>
                        </div>
                    </div>

                    <div className="col-11 mx-auto col-md-6">
                        <div className="p-3 bg-dark rounded shadow-sm analytics-item">
                            <p className="fs-5 fw-normal">Total revenue</p>
                            <p className="fs-1 fw-bold mb-1 text-revenue">2400</p>
                        </div>
                    </div>

                    <div className="col-11 mx-auto col-md">
                        <div className="p-3 bg-dark rounded shadow-sm analytics-item">
                            <p className="fs-5 fw-normal">Total items ordered</p>
                            <p className="fs-1 fw-bold mb-1">160</p>
                        </div>
                    </div>
                </div>

                <div className="row g-4 mb-4">
                    <div className="col-11 mx-auto col-md">
                        <div className="p-3 bg-dark rounded shadow-sm analytics-item">
                            <p className="fs-5 fw-normal">Occupation rate</p>
                            <OccupationPie />
                        </div>
                    </div>

                    <div className="col-11 mx-auto col-md-8">
                        <div className="p-3 bg-dark rounded shadow-sm analytics-item">
                            <p className="fs-5 fw-normal">Top 3 sellers</p>
                            {topSellers.map((item, index) => (
                                <p key={index} className="fs-4 fw-bold mb-1">
                                {item}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-11 mx-auto col-md">
                        <div className="p-3 bg-dark rounded shadow-sm analytics-item">
                            <p className="fs-5 fw-normal">Weekly orders</p>
                            <OrdersGraph />
                        </div>
                    </div>

                    <div className="col-11 mx-auto col-md">
                        <div className="p-3 bg-dark rounded shadow-sm analytics-item">
                            <p className="fs-5 fw-normal">Weekly revenue</p>
                            <RevenueGraph />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnalyticsPage;