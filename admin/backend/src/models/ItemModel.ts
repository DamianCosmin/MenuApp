import { Schema, model } from "mongoose";
import { Item } from "../../../frontend/src/utils/types.js";

export const itemSchema = new Schema<Item>({
    categoryID: {
        type: Number,
        required: true,
    },
    itemID: {
        type: Number,
        required: true,
    },
    itemName: {
        type: String,
        required: true,
    },
    itemPrice: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
        default: '',
    },
    photoPath: {
        type: String,
        required: true,
    }
}, {
    autoCreate: false
});

export const ItemModel = model<Item>('Item', itemSchema);
