import { Schema, model } from "mongoose";

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
        index: true,
        expires: 604800,
    }
});

export const AnalyticsModel = model('Analytics', analyticsSchema, 'analytics');