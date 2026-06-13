import mongoose from "mongoose";
import { OrderModel, PendingOrderModel } from "./models/OrderModel.js";
import { CounterModel } from "./models/CounterModel.js";
import { OrderItemAnalyticsModel } from "./models/OrderItemModel.js";
import { AnalyticsModel } from "./models/AnalyticsModel.js";
import { BookedTablesModel } from "./models/BookedTablesModel.js";
import { PaymentModel } from "./models/PaymentModel.js";
import { UserModel } from "./models/UserModel.js";
import { Order, PaymentData, User } from "./types.js";

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
            { returnDocument: 'after', upsert: true}
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

export async function deletePendingOrder(orderID: number) {
    if (orderID == null) {
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
    if (orderID == null) {
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
                { returnDocument: 'after', upsert: true}
            )
            
            const previousID = orderData.id;
            orderData.id = confirmedID.seq;
            orderData.createdAt = new Date();
            orderData.expiresAt = getNextDayStart();

            const confirmedOrder = await OrderModel.create(orderData);

            const bookedResult = await BookedTablesModel.findOneAndUpdate(
                { name: 'indexes'},
                { $addToSet: {booked: orderData.tableID} },
                { returnDocument: 'after', upsert: true }
            );

            if (!bookedResult) {
                return null;
            }

            return { confirmedOrder, roomNumber: previousID };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error in saving the order: ", error);
        return null;
    }
}

export async function finishOrder(orderID: number) {
    if (orderID == null) {
        return null;
    }

    try {
        const currentOrder = await OrderModel.findOneAndUpdate(
            { id: orderID, status: 'Confirmed' },
            { $set: {status: 'Finished'} },
            { returnDocument: 'after' }
        );

        if (currentOrder) {
            const {_id, __v, ...finishedOrder} = currentOrder.toObject();

            return finishedOrder;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error in finishing the order: ", error);
        return null;
    }
}

export async function changeOrdersStatus(orders: Order[], givenStatus: String) {
    if (!orders || !givenStatus) {
        return;
    }

    try {
        let dbPromises = [];

        for (let ord of orders) {
            dbPromises.push(OrderModel.findOneAndUpdate(
                { "id": ord.id },
                { $set: {status: givenStatus} },
                { returnDocument: 'after' }
            ))
        }

        await Promise.all(dbPromises);
    } catch (error) {
        console.error("Error in archiving the orders: ", error);
    }
}

export async function getAllOrders() {
    try {
        const todayStart = getTodayStart();
        const pendingOrders = await PendingOrderModel.find({});
        const confirmedOrders = await OrderModel.find({ status: {$nin: ['Archived', 'Paid']}, createdAt: {$gte: todayStart} });

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
        const tableOrders = await OrderModel.find({ tableID: tblID, status: {$nin: ['Archived', 'Paid']}, createdAt: {$gte: todayStart} });
        return tableOrders;
    } catch (error) {
        console.error(`Error in getting orders from table ${tblID}: `, error);
        return null;
    }
}

export async function getBookedTables() {
    try {
        const bookedTables = await BookedTablesModel.findOne({name: 'indexes'});

        return bookedTables ? bookedTables.booked : [];
    } catch (error) {
        console.error("Error in getting the booked tables indexes: ", error);
        return null;
    }
}

export async function freeTable(tableID: number) {
    if (tableID == null) {
        return null;
    }

    try {
        const leftBooked = await BookedTablesModel.findOneAndUpdate(
            { name: 'indexes' },
            { $pull: {booked: tableID} },
            { returnDocument: 'after' }
        );

        return leftBooked ? leftBooked.booked.length : null;
    } catch (error) {
        console.error(`Error in freeing the table ${tableID}: `, error);
        return null;
    }
}

export async function updateAnalytics(order: Order, nrBookedTables: number, totalTables: number) {
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
                { returnDocument: 'after', upsert: true }
            ));
        }

        await Promise.all(dbPromises);

        const occupation = (nrBookedTables / totalTables) * 100;
        const occupationPercent = Math.round(occupation * 100) / 100;
        const todayStart = getTodayStart();

        await AnalyticsModel.findOneAndUpdate(
            { createdAt: {$gte: todayStart} },
            {  
                $inc: {totalOrders: 1, totalRevenue: order.total, totalItems: totalItemsInOrder},
                $set: {occupationRate: occupationPercent},
                $setOnInsert: {createdAt: todayStart}
            },
            { returnDocument: 'after', upsert: true }
        );
    } catch (error) {
        console.error("Error in updating order items for analytics: ", error);
    }
}

export async function updateOccupationRate(nrBookedTables: number, totalTables: number) {
    if (nrBookedTables == null || totalTables == null) {
        return;
    }

    try {
        const occupation = (nrBookedTables / totalTables) * 100;
        const occupationPercent = Math.round(occupation * 100) / 100;
        const todayStart = getTodayStart();

        await AnalyticsModel.findOneAndUpdate(
            { createdAt: {$gte: todayStart} },
            { $set: {occupationRate: occupationPercent} },
            { returnDocument: 'after', upsert: true }
        );
    } catch (error) {
        console.error("Error in updating the occupation rate: ", error);
    }
}

export async function updateTips(tipAmount: number) {
    if (tipAmount == null) {
        return;
    }

    try {
        const todayStart = getTodayStart();

        await AnalyticsModel.findOneAndUpdate(
            { createdAt: {$gte:  todayStart} },
            { $inc: {totalTips: tipAmount} },
            { returnDocument: 'after', upsert: true }
        );
    } catch (error) {
        console.error("Error in updating the tips: ", error);
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
        console.error("Error in getting today's analytics: ", error);
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

export async function addPendingPayment(body: any) {
    if (!body) {
        return null;
    }

    try {
        const paymentID = await CounterModel.findOneAndUpdate(
            { name: 'payments' },
            { $inc: {seq: 1} },
            { returnDocument: 'after', upsert: true }
        )

        const tomorrowStart = getNextDayStart();
        const overmorrowStart = tomorrowStart.setDate(tomorrowStart.getDate() + 1);

        const newPayment: PaymentData = {
            id: paymentID.seq,
            status: "Pending",
            ...body,
            createdAt: new Date(),
            expiresAt: overmorrowStart
        }

        await PaymentModel.create(newPayment);
        return newPayment;
    } catch (error) {
        console.error("Error in saving the pending payment: ", error);
        return null;
    }
}

export async function getAllPayments() {
    try {
        const todayStart = getTodayStart();
        const payments = await PaymentModel.find({ createdAt: {$gte: todayStart} });

        return payments;
    } catch (error) {
        console.error("Error in getting the payments: ", error);
        return null;
    }
}

export async function completePayment(paymentID: number) {
    if (paymentID == null) {
        return null;
    }

    try {
        const todayStart = getTodayStart();
        const currentPayment = await PaymentModel.findOneAndUpdate(
            { id: paymentID, createdAt: {$gte: todayStart} },
            { $set: {status: 'Completed'} },
            { returnDocument: 'after' }
        )

        if (currentPayment) {
            const {_id, __v, ...completedPayment} = currentPayment.toObject();

            return completedPayment;
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error in completing the payment: ", error);
        return null;
    }
}

export async function createAdminUser(clerkId: string, email: string) {
    if (clerkId == null || email == null) {
        return null;
    }

    try {
        const newUser: User = {
            clerkUserId: clerkId,
            email: email,
            createdAt: new Date(),
            lastLogin: new Date()
        }

        await UserModel.create(newUser);
        return newUser;
    } catch (error) {
        console.error("Error in saving the user: ", error);
        return null;
    }
}

export async function updateUserLoginDate(email: string) {
    if (email == null) {
        return null;
    }

    try {
        const result = await UserModel.findOneAndUpdate(
            { email: email },
            { $set: {lastLogin: new Date()} },
            { returnDocument: 'after' }
        );

        if (result) {
            const {_id, __v, ...user} = result.toObject();
            return user;
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error in updating the login date for user ${email}: `, error);
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
        await BookedTablesModel.deleteMany({});
        await PaymentModel.deleteMany({});
    } catch (error) {
        console.error("Error in cleaning databases: ", error);
    }
}