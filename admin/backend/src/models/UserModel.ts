import { Schema, model } from "mongoose";

export const userSchema = new Schema({
    clerkUserId: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    }
});

export const UserModel = model('User', userSchema, 'users');
