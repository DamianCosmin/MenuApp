import { Schema, model } from "mongoose";
import { Order } from "../../../frontend/src/utils/types.js";
import { orderItemSchema } from "./OrderItemModel.js";

export const orderSchema = new Schema<Order>({
    id: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    tableID: {
        type: Number,
        required: true,
    }, 
    items: {
        type: [orderItemSchema],
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
        expires: 604800, // 604800 seconds = 7 days
    }
});

export const OrderModel = model<Order>('Order', orderSchema, 'orders');
export const PendingOrderModel = model<Order>('PendingOrder', orderSchema, 'pending');
