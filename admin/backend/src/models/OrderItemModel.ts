import { Schema, model } from "mongoose";
import { OrderItem } from "../../../frontend/src/utils/types.js";
import { itemSchema } from "./ItemModel.js";

export const orderItemSchema = new Schema<OrderItem>({
    item: {
        type: itemSchema,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    }
});

export const OrderItemAnalyticsModel = model<OrderItem>('OrderItemAnalytics', orderItemSchema, 'allitems');
