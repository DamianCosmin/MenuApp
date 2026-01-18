import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

import * as Database from "./database_provider.js";
import { sendCustomAnalytics } from "./analytics.js";

// Configuration
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;
const API_URL = process.env.API_URL || "http://127.0.0.1/api";

// Middleware
app.use(cors());
app.use(express.json());

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
await Database.helperClearDatabases(); // temporary

// Websockets
io.on("connection", (socket) => {
  socket.on("joinOrderRoom", (orderId) => {
    socket.join(orderId.toString());
    console.log(`Socket ${socket.id} joined room ${orderId} from backend`);
  });
});

let BOOKED_TABLES: number[] = [];
const NR_TABLES = 23;

// Routes
app.post("/api/new_order", async (req, res) => {
  const newOrder = await Database.addPendingOrder(req.body);
  io.emit("newOrder", newOrder);

  console.log("New order received:", newOrder);
  return res.status(201).json({ message: "New order received", order: newOrder });
});


app.get("/api/orders", async (_, res) => {
  const allOrders = await Database.getAllOrders();
  return res.json(allOrders);
});


app.put("/api/orders/:id", async (req, res) => {
  const orderID = parseInt(req.params.id);
  const { newStatus } = req.body;

  if (newStatus === 'Confirmed') {
    const result = await Database.addOrderToDB(orderID);

    if (!result) {
      return res.status(404).json({ message: "Order to be confirmed not found" });
    }

    const { confirmedOrder, roomNumber } = result;
  
    if (!BOOKED_TABLES.includes(confirmedOrder.tableID)) {
      BOOKED_TABLES.push(confirmedOrder.tableID);
    }

    await Database.updateAnalytics(confirmedOrder, BOOKED_TABLES.length, NR_TABLES);

    io.emit("orderConfirmed", {updatedOrder: confirmedOrder, pendingId: roomNumber, indexes: BOOKED_TABLES});
    io.to(roomNumber.toString()).emit("adminConfirmed");

    return res.json({ message: "Order updated", confirmedOrder });
  }
});


app.delete("/api/orders/:id", async (req, res) => {
  const orderID = parseInt(req.params.id);

  const deletedOrder = await Database.deletePendingOrder(orderID);
  if (!deletedOrder) {
    return res.status(404).json({ message: "Order to be deleted not found" });
  }

  io.emit("orderDeleted", deletedOrder);
  io.to(deletedOrder.id.toString()).emit("adminDeclined");

  return res.json({ message: "Order deleted", order: deletedOrder });
});


app.get("/api/tables/indexes", (_, res) => {
  res.json(BOOKED_TABLES);
})


app.get("/api/tables/:tblId", async (req, res) => {
  const givenTable = parseInt(req.params.tblId);

  const tableOrders = await Database.getTableOrders(givenTable);
  res.json(tableOrders);
});


app.get("/api/analytics", async (_, res) => {
  let customAnalyticsData = await sendCustomAnalytics(["ALL"]);
  res.json(customAnalyticsData);
});


app.get("/api/analytics/:fields", async (req, res) => {
  const fields: string[] = req.params.fields.split(",");

  let customAnalyticsData = await sendCustomAnalytics(fields);
  res.json(customAnalyticsData);
});


// Start server
httpServer.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
