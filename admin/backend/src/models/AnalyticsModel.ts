import { Schema, model } from "mongoose";
import { getTodayStart } from "../database_provider.js";

const analyticsSchema = new Schema({
    totalOrders: {
        type: Number,
        required: true,
        default: 0,
    },
    totalRevenue: {
        type: Number,
        required: true,
        default: 0,
    },
    totalItems: {
        type: Number,
        required: true,
        default: 0,
    },
    occupationRate: {
        type: Number,
        required: true,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: getTodayStart,
        index: true,
        expires: 604800, // 604800 seconds = 7 days
    }
});

export const AnalyticsModel = model('Analytics', analyticsSchema, 'analytics');