// backend/src/server.ts
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const PORT = 5000;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

let orders: any[] = [];
let ordersID: number = 1;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post("/api/new_order", (req, res) => {
  let newOrder = {
    id: ordersID,
    status: "Pending",
    ...req.body
  }

  orders.push(newOrder);
  ordersID++;

  io.emit("newOrder", newOrder);

  console.log("New order received:", newOrder);
  res.status(201).json({ order: newOrder });
});

app.get("/api/orders", (req, res) => {
  res.json(orders);
});

app.put("/api/orders/:id", (req, res) => {
  const orderID = parseInt(req.params.id);
  const {newStatus} = req.body;

  const order = orders.find(o => o.id === orderID);
  if (!order) {
    return res.status(404).json({ message: "Order to be confirmed not found" });
  }

  if (newStatus) {
    order.status = newStatus;
    io.emit("orderConfirmed", order);
  }

  res.json({ message: "Order updated", order });
});

app.delete("/api/orders/:id", (req, res) => {
  const orderID = parseInt(req.params.id);

  const index = orders.findIndex(o => o.id === orderID);
  if (index === -1) {
    return res.status(404).json({ message: "Order to be deleted not found" });
  }

  const deletedOrder = orders.splice(index, 1)[0] // because its an array of deleted items;
  io.emit("orderDeleted", deletedOrder);

  res.json({ message: "Order deleted", order: deletedOrder });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`💡 Backend running at http://localhost:${PORT}`);
});
