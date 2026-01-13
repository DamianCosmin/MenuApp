import OrdersGraph from '../components/OrdersGraph.tsx'
import RevenueGraph from '../components/RevenueGraph.tsx';
import OccupationPie from '../components/OccupationPie.tsx';
import { useEffect, useState } from 'react';
import { BASE_URL } from '../utils/routes.ts';
import { AnalyticsData } from '../utils/types.ts';

const primaryButtons = ["ALL", "MAINS", "DRINKS"];
const secondaryButtons = ["BURGERS", "PIZZA", "PASTA", "COFFEE", "SOFTDRINKS", "WINES", "DESSERTS"];

const invalidBestSellers = ["N/A", "N/A", "N/A"];

function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);

    const [primary, setPrimary] = useState<"ALL" | "MAINS" | "DRINKS" | null>("ALL");
    const [secondary, setSecondary] = useState<string[]>([]);

    const handlePrimaryButtons = (button: "ALL" | "MAINS" | "DRINKS") => {
        setPrimary(button);

        if (secondary.length > 0) {
            setSecondary([]);
        }
    }

    const handleSecondaryButtons = (button: string) => {
        setPrimary(null);

        setSecondary(prev => {
            const updatedSecondary = prev?.includes(button)
                ? prev.filter(s => s !== button) // deactivate if already active
                : [...prev, button] // add to active secondary buttons array

                if (updatedSecondary.length === 0 && primary == null){
                    setPrimary("ALL");
                }

            return updatedSecondary;
        }); 
    }

    const fetchCustomAnalyticsData = async (categories: string[]) => {
        const res = await fetch(`${BASE_URL}/api/analytics/${categories.toString()}`);
        const analytics = await res.json() as AnalyticsData;
        console.log(analytics);

        let customAnalytics: AnalyticsData = {
            totalOrders: analytics?.totalOrders ?? 0,
            totalRevenue: analytics.totalRevenue ?? 0,
            totalItems: analytics.totalItems ?? 0,
            occupation: analytics?.occupation ?? 0,
            bestSellers: analytics?.bestSellers ?? []
        }

        setData(customAnalytics);
    };

    useEffect(() => {
        if (secondary.length > 0) {
            fetchCustomAnalyticsData(secondary);
        } else {
            switch (primary) {
                case "ALL": 
                    fetchCustomAnalyticsData(["ALL"]);
                    break;
                case "DRINKS":
                    fetchCustomAnalyticsData(["DRINKS"]);
                    break;
                case "MAINS":
                    fetchCustomAnalyticsData(["MAINS"]);
                    break;
                default:
                    console.log("Error fetching primary type orders");
            }
        }
    }, [primary, secondary]);

    return (
        <div className="analytics-page">
            <div className="container text-light">
                <div className='d-flex flex-column flex-md-row justify-content-center align-items-center mb-4'>
                    <div className="d-flex flex-row flex-wrap justify-content-center">
                        {primaryButtons.map(btn => (
                            <label key={btn}>
                                <input type='checkbox' checked={primary === btn} className='analytics-tag' onChange={() => handlePrimaryButtons(btn as "ALL" | "MAINS" | "DRINKS")}/>
                                <span>{btn}</span>
                            </label>
                        ))}
                    </div>
                    
                    <hr className="d-md-none w-50 my-3 text-revenue opacity-50" />
                    <div className="vr d-none d-md-block mx-2 text-revenue opacity-50"></div>

                    <div className="d-flex flex-row flex-wrap justify-content-center">
                        {secondaryButtons.map(btn => (
                            <label key={btn}>
                                <input type='checkbox' checked={secondary.includes(btn)} className='analytics-tag'  onChange={() => {handleSecondaryButtons(btn)}}/>
                                <span>{btn}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="row g-4 mb-4">
                    <div className="col-11 mx-auto col-md">
                        <div className="p-3 bg-dark rounded shadow-sm analytics-item">
                            <p className="fs-5 fw-normal">Total orders</p>
                            <p className="fs-1 fw-bold mb-1 text-orders">{data ? data.totalOrders : 'N/A'}</p>
                        </div>
                    </div>

                    <div className="col-11 mx-auto col-md-6">
                        <div className="p-3 bg-dark rounded shadow-sm analytics-item">
                            <p className="fs-5 fw-normal">Total revenue</p>
                            <p className="fs-1 fw-bold mb-1 text-revenue">{data ? data.totalRevenue.toFixed(2) + ' RON': 'N/A'}</p>
                        </div>
                    </div>

                    <div className="col-11 mx-auto col-md">
                        <div className="p-3 bg-dark rounded shadow-sm analytics-item">
                            <p className="fs-5 fw-normal">Total items ordered</p>
                            <p className="fs-1 fw-bold mb-1">{data ? data.totalItems : 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div className="row g-4 mb-4">
                    <div className="col-11 mx-auto col-md">
                        <div className="p-3 bg-dark rounded shadow-sm analytics-item">
                            <p className="fs-5 fw-normal">Occupation rate</p>
                            <OccupationPie rate={data ? Number(data.occupation) : 0} />
                        </div>
                    </div>

                    <div className="col-11 mx-auto col-md-8">
                        <div className="p-3 bg-dark rounded shadow-sm analytics-item">
                            <p className="fs-5 fw-normal">Top 3 sellers</p>
                            {data?.bestSellers ? data.bestSellers.map((name, index) => (
                                <p key={index} className="fs-4 fw-bold mb-1">
                                {index + 1}. {name}
                                </p>
                            )) : invalidBestSellers.map((name, index) => (
                                <p key={index} className="fs-4 fw-bold mb-1">
                                {index + 1}. {name}
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