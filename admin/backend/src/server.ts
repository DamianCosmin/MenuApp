import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

import * as Database from "./database_provider.js";
import { sendCustomAnalytics } from "./analytics.js";
import { Order, AnalyticsData, PaymentData } from "./types.js";

import { clerkMiddleware } from "@clerk/express";
import authRouter from "./auth.js";

// Configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;
const API_URL = process.env.API_URL || "http://127.0.0.1/api";
const NR_TABLES = 23;

// Middleware
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());
app.use("/api/auth", authRouter);

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: "*" },  
});

// Database
try {
    await Database.connectToMongoDB();
} catch (e) {
    console.error(e);
}
// await Database.helperClearDatabases(); // temporary

// Websockets
io.on("connection", (socket) => {
    socket.on("joinOrderRoom", (orderId) => {
        socket.join(orderId.toString());
        console.log(`Socket ${socket.id} joined room ${orderId} from backend`);
    });
});

// Routes
app.post("/api/new_order", async (req, res) => {
    const newOrder: Order | null = await Database.addPendingOrder(req.body);

    if (!newOrder) {
        return res.status(400).json({ message: "Failed to create order" });
    }

    io.emit("newOrder", newOrder);

    console.log("New order received:", newOrder);
    return res.status(201).json({ message: "New order received", order: newOrder });
});


app.get("/api/orders", async (_, res) => {
    const allOrders: Order[] | null = await Database.getAllOrders();

    if (!allOrders) {
        return res.status(400).json({ message: "Failed to get all orders" });
    }

    return res.json(allOrders);
});


app.put("/api/orders/:id", async (req, res) => {
    const orderID = parseInt(req.params.id);
    const { newStatus } = req.body;

    if (newStatus === 'Confirmed') {
        const result = await Database.addOrderToDB(orderID);
        const bookedTables = await Database.getBookedTables()

        if (!result || !bookedTables) {
            return res.status(404).json({ message: "Order to be confirmed not found" });
        }

        const confirmedOrder: Order | null = result.confirmedOrder; 
        const roomNumber = result.roomNumber;

        if (!confirmedOrder) {
            return res.status(404).json({ message: "Order to be confirmed not found" });
        }

        await Database.updateAnalytics(confirmedOrder, bookedTables.length, NR_TABLES);

        io.emit("orderConfirmed", {updatedOrder: confirmedOrder, pendingId: roomNumber, indexes: bookedTables});
        io.to(roomNumber.toString()).emit("adminConfirmed");

        return res.json({ message: "Order updated", confirmedOrder });
    }

    if (newStatus === 'Finished') {
        const finishedOrder = await Database.finishOrder(orderID);

        if (!finishedOrder) {
            return res.status(404).json({ message: "Order to be finished not found" });
        }

        io.emit("orderFinished", finishedOrder);

        return res.json({ message: "Order finished", finishedOrder});
    }
});


app.delete("/api/orders/:id", async (req, res) => {
    const orderID = parseInt(req.params.id);
    const deletedOrder: Order | null = await Database.deletePendingOrder(orderID);

    if (!deletedOrder) {
        return res.status(404).json({ message: "Order to be deleted not found" });
    }

    io.emit("orderDeleted", deletedOrder);
    io.to(deletedOrder.id.toString()).emit("adminDeclined");

    return res.json({ message: "Order deleted", order: deletedOrder });
});


app.get("/api/tables/indexes", async (_, res) => {
    const bookedTables: Number[] | null = await Database.getBookedTables();
    res.json(bookedTables);
})


app.get("/api/tables/:tblId", async (req, res) => {
    const givenTable = parseInt(req.params.tblId);

    const tableOrders: Order[] | null = await Database.getTableOrders(givenTable);
    res.json(tableOrders);
});


app.get("/api/analytics/graphs", async (req, res) => {
    // createdAt field is needed, so we do not cast to AnalyticsData
    let graphsData = await Database.getGraphsData();
    res.json(graphsData);
})


app.get("/api/analytics", async (_, res) => {
    let customAnalyticsData: AnalyticsData = await sendCustomAnalytics(["ALL"]);
    res.json(customAnalyticsData);
});


app.get("/api/analytics/:fields", async (req, res) => {
    const fields: string[] = req.params.fields.split(",");

    let customAnalyticsData: AnalyticsData = await sendCustomAnalytics(fields);
    res.json(customAnalyticsData);
});


app.post("/api/new_payment", async (req, res) => {
    const newPayment: PaymentData | null = await Database.addPendingPayment(req.body);

    if (!newPayment) {
        return res.status(400).json({ message: "Failed to initiate payment" });
    }

    await Database.changeOrdersStatus(newPayment.orders, 'Archived');

    const leftBooked: number | null = await Database.freeTable(newPayment.tableID);

    if (leftBooked == null) {
        return res.status(404).json({ message: "Table to be freed not found" });
    }

    await Database.updateOccupationRate(leftBooked, NR_TABLES);

    io.emit("newPayment", newPayment);

    console.log("New payment received:", newPayment);
    return res.status(201).json({ message: "New payment received" , payment: newPayment});
})


app.get("/api/payments", async (_, res) => {
    const allPayments = await Database.getAllPayments();

    if (!allPayments) {
        return res.status(400).json({ message: "Failed to get all payments" });
    }

    return res.json(allPayments);
})


app.put("/api/payments/:id", async (req, res) => {
    const paymentID = parseInt(req.params.id);
    const { newStatus } = req.body;

    if (newStatus === 'Completed') {
        const completedPayment: PaymentData | null = await Database.completePayment(paymentID);

        if (!completedPayment) {
            return res.status(404).json({ message: "Payment to be completed not found" });
        }

        await Database.changeOrdersStatus(completedPayment.orders, 'Paid');
        await Database.updateTips(completedPayment.totalTips);

        io.emit("paymentCompleted", completedPayment);

        return res.json({ message: "Payment completed", completedPayment });
    }
});


// Start server
httpServer.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
});
