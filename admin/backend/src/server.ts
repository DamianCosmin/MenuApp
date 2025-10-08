import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const PORT = 5050;

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

let ORDERS: any[] = [];
let ORDERS_ID: number = 1;
let BOOKED_TABLES: number[] = [];

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post("/api/new_order", (req, res) => {
  let newOrder = {
    id: ORDERS_ID,
    status: "Pending",
    ...req.body
  }

  ORDERS.push(newOrder);
  ORDERS_ID++;

  io.emit("newOrder", newOrder);

  console.log("New order received:", newOrder);
  res.status(201).json({ order: newOrder });
});

app.get("/api/orders", (_, res) => {
  res.json(ORDERS);
});

app.put("/api/orders/:id", (req, res) => {
  const orderID = parseInt(req.params.id);
  const {newStatus} = req.body;

  const order = ORDERS.find(o => o.id === orderID);
  if (!order) {
    return res.status(404).json({ message: "Order to be confirmed not found" });
  }

  if (newStatus === 'Confirmed') {
    order.status = newStatus;

    if (!BOOKED_TABLES.includes(order.tableID)) {
      BOOKED_TABLES.push(order.tableID);
    }

    io.emit("orderConfirmed", {updatedOrder: order, indexes: BOOKED_TABLES}); 
  }

  res.json({ message: "Order updated", order });
});

app.delete("/api/orders/:id", (req, res) => {
  const orderID = parseInt(req.params.id);

  const index = ORDERS.findIndex(o => o.id === orderID);
  if (index === -1) {
    return res.status(404).json({ message: "Order to be deleted not found" });
  }

  const deletedOrder = ORDERS.splice(index, 1)[0] // because it's an array of deleted items
  io.emit("orderDeleted", deletedOrder);

  res.json({ message: "Order deleted", order: deletedOrder });
});

app.get("/api/tables/indexes", (_, res) => {
  res.json(BOOKED_TABLES);
})

app.get("/api/tables/:tblId", (req, res) => {
  const givenTable = parseInt(req.params.tblId);

  const orders = ORDERS.filter(o => o.tableID === givenTable && o.status === 'Confirmed');

  res.json(orders);
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`💡 Backend running at http://localhost:${PORT}`);
});
