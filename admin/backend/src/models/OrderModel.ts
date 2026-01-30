import { Schema, model } from "mongoose";
import { orderItemSchema } from "./OrderItemModel.js";

export const orderSchema = new Schema({
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
    },
    expiresAt: {
        type: Date,
        index: true,
        expires: 0,
    }
});

export const OrderModel = model('Order', orderSchema, 'orders');
export const PendingOrderModel = model('PendingOrder', orderSchema, 'pending');
