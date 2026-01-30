import { Schema, model } from "mongoose";
import { getTodayStart } from "../database_provider.js";
import { itemSchema } from "./ItemModel.js";

export const orderItemSchema = new Schema({
    item: {
        type: itemSchema,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    }
}, {
    autoCreate: false
});

export const orderItemAnalyticsSchema = new Schema({
    item: {
        type: itemSchema,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        default: getTodayStart,
        index: true,
        expires: 86400, // 86400 seconds = 24 hours
    }
})

export const OrderItemAnalyticsModel = model('OrderItemAnalytics', orderItemAnalyticsSchema, 'allitems');
