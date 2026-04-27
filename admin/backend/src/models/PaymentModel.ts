import { Schema, model } from "mongoose";
import { orderSchema } from "./OrderModel.js";
import { getTodayStart } from "../database_provider.js";

const paymentSchema = new Schema({
    id: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    totalTips: {
        type: Number,
        required: true,
    },
    method: {
        type: String,
        required: true,
    },
    tableID: {
        type: Number,
        required: true,
    }, 
    orders: {
        type: [orderSchema],
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

export const PaymentModel = model('Payments', paymentSchema, 'payments');
