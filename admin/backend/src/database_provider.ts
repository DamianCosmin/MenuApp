import mongoose from "mongoose";
import { OrderModel, PendingOrderModel } from "./models/OrderModel.js";
import { CounterModel } from "./models/CounterModel.js";
import { OrderItemAnalyticsModel } from "./models/OrderItemModel.js";
import { AnalyticsModel } from "./models/AnalyticsModel.js";
import { Order } from "../../frontend/src/utils/types.js";

export function getTodayStart() {
    const midnight = new Date();
    midnight.setUTCHours(0, 0, 0, 0);
    return midnight;
}

function getNextDayStart() {
    const nextMidnight = new Date();
    nextMidnight.setUTCHours(24, 0, 0, 0);
    return nextMidnight;
}

function getCurrentMonday() {
    const today = new Date();
    const day = today.getDay();
    const diff = day === 0 ? 6 : day - 1;
    
    const monday = new Date(today);
    monday.setDate(today.getDate() - diff);
    monday.setUTCHours(0, 0, 0, 0);

    return monday;
}

export async function connectToMongoDB() {
    const mongodbUrl = process.env.MONGODB_URL;
    if (mongodbUrl == null) {
        throw new Error("Missing MongoDB environment variable!");
    }

    try {
        await mongoose.connect(mongodbUrl);
        console.log("Connected successfully to database using Mongoose!");
    } catch (error) {
        console.error("Error in connecting to the database: ", error);
    }
}

export async function addPendingOrder(body: any) {
    if (!body) {
        return null;
    }

    try {
        const pendingID = await CounterModel.findOneAndUpdate(
            { name: 'pending' },
            { $inc: {seq: 1} },
            { new: true, upsert: true}
        )

        const newOrder: Order = {
            id: pendingID.seq,
            status: "Pending",
            ...body,
            createdAt: new Date(),
            expiresAt: getNextDayStart()
        }

        await PendingOrderModel.create(newOrder);
        return newOrder;
    } catch (error) {
        console.error("Error in saving the pending order: ", error);
        return null;
    }
}

export async function deletePendingOrder(orderID: Number) {
    if (!orderID) {
        return null;
    }

    try {
        const deletedOrder = await PendingOrderModel.findOneAndDelete({ id: orderID });
        return deletedOrder;
    } catch (error) {
        console.error("Error in deleting the pending order: ", error);
        return null;
    }
}

export async function addOrderToDB(orderID: number) {
    if (!orderID) {
        return null;
    }

    try {
        const pendingOrder = await PendingOrderModel.findOneAndDelete({ id: orderID });

        if (pendingOrder) {
            const { _id, __v, ...orderData } = pendingOrder.toObject();
            orderData.status = "Confirmed";

            const confirmedID = await CounterModel.findOneAndUpdate(
                { name: 'confirmed' },
                { $inc: {seq: 1} },
                { new: true, upsert: true}
            )
            
            const previousID = orderData.id;
            orderData.id = confirmedID.seq;
            orderData.createdAt = new Date();
            orderData.expiresAt = getNextDayStart();

            const confirmedOrder = await OrderModel.create(orderData);
            return { confirmedOrder, roomNumber: previousID };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error in saving the order: ", error);
        return null;
    }
}

export async function getAllOrders() {
    try {
        const todayStart = getTodayStart();
        const pendingOrders = await PendingOrderModel.find({});
        const confirmedOrders = await OrderModel.find({ createdAt: {$gte: todayStart} });

        const allOrders = pendingOrders.concat(confirmedOrders);
        return allOrders;
    } catch (error) {
        console.error("Error in getting the orders: ", error);
        return null;
    }
}

export async function getTableOrders(tblID: number) {
    if (tblID == null) {
        return null;
    }

    try {
        const todayStart = getTodayStart();
        const tableOrders = await OrderModel.find({ tableID: tblID, createdAt: {$gte: todayStart} });
        return tableOrders;
    } catch (error) {
        console.error(`Error in getting orders from table ${tblID}: `, error);
        return null;
    }
}

export async function updateAnalytics(order: Order, bookedTables: number, totalTables: number) {
    if (order == null) {
        return;
    }

    try {
        let totalItemsInOrder = 0;
        let dbPromises = [];

        for (let ordItem of order.items) {
            let currentItem = ordItem.item;
            let qty = ordItem.quantity;

            totalItemsInOrder += qty;

            dbPromises.push(OrderItemAnalyticsModel.findOneAndUpdate(
                { "item.itemID": currentItem.itemID, "item.categoryID": currentItem.categoryID },
                { $inc: {quantity: qty}, $setOnInsert: {item: currentItem} },
                { new: true, upsert: true }
            ));
        }

        await Promise.all(dbPromises);

        const occupation = (bookedTables / totalTables) * 100;
        const occupationPercent = Math.round(occupation * 100) / 100;
        const todayStart = getTodayStart();

        await AnalyticsModel.findOneAndUpdate(
            { createdAt: {$gte: todayStart} },
            {  
                $inc: {totalOrders: 1, totalRevenue: order.total, totalItems: totalItemsInOrder},
                $set: {occupationRate: occupationPercent},
                $setOnInsert: {createdAt: todayStart}
            },
            { new: true, upsert: true }
        );
    } catch (error) {
        console.error("Error in updating order items for analytics: ", error);
    }
}

export async function getTodayAnalytics() {
    try {
        const todayStart = getTodayStart();
        const result = await AnalyticsModel.findOne({ createdAt: {$gte: todayStart} });
        if (result) {
            const {_id, __v, createdAt, ...analytics} = result.toObject();
            return analytics;
        } else {
            return null;
        }
    } catch (error) {
        console.log("Error in getting today's analytics: ", error);
        return null;
    }
}

export async function getCategoryOrderItems(category: number) {
    if (category == null) {
        return null;
    }

    try {
        const categoryItems = await OrderItemAnalyticsModel.find({ "item.categoryID": category });
        return categoryItems;
    } catch (error) {
        console.error(`Error in getting orders from category ${category}: `, error);
        return null;
    }
}

export async function getGraphsData() {
    const monday = getCurrentMonday();

    try {
        const result = await AnalyticsModel.find({ "createdAt": {$gte: monday} });

        if (result) {
            const graphsData = [];
            for (let entry of result) {
                const {_id, __v, ...fields} = entry.toObject();
                graphsData.push(fields);
            }
            return graphsData;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error in getting the graphs data: ", error);
        return null;
    }
}

// Temporary function for testing purposes
export async function helperClearDatabases() {
    try {
        await OrderModel.deleteMany({});
        await PendingOrderModel.deleteMany({});
        await CounterModel.deleteMany({});
        await OrderItemAnalyticsModel.deleteMany({});
        await AnalyticsModel.deleteMany({});
    } catch (error) {
        console.error("Error in cleaning databases: ", error);
    }
}