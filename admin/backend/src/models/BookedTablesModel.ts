import { Schema, model } from "mongoose";
import { getTodayStart } from "../database_provider.js";

const bookedTablesSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    booked: {
        type: [Number],
        required: true,
        default: [],
    },
    createdAt: {
        type: Date,
        default: getTodayStart,
        index: true,
        expires: 86400,
    }
})

export const BookedTablesModel = model('BookedTables', bookedTablesSchema, 'booked');