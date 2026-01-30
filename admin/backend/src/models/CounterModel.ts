import { Schema, model } from "mongoose";
import { getTodayStart } from "../database_provider.js";

export const counterSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    seq: {
        type: Number,
        required: true,
        default: 1,
    },
    createdAt: {
        type: Date,
        default: getTodayStart,
        index: true,
        expires: 86400, // 86400 seconds = 24 hours
    }
});

export const CounterModel = model('Counter', counterSchema, 'counters');
