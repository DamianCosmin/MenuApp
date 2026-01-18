import { Schema, model } from "mongoose";

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
    }
});

export const CounterModel = model('Counter', counterSchema, 'counters');
