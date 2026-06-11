import express from "express";
import { clerkClient } from "@clerk/express";
import * as Database from "./database_provider.js";
import { User } from "./types.js";

const router = express.Router();

router.post("/sign-up", async (req, res) => {
    const {email, password, secretKey} = req.body;

    if (!email || !password || !secretKey) {
        return res.status(400).json({ message: "Missing data!" });
    }

    if (secretKey !== process.env.ADMIN_KEY) {
        return res.status(403).json({ message: "Invalid secret key!" });
    }

    try {
        const clerkUser = await clerkClient.users.createUser({
            emailAddress: [email],
            password: password,
        });

        const signInToken = await clerkClient.signInTokens.createSignInToken({
            userId: clerkUser.id,
            expiresInSeconds: 180
        });

        await Database.createAdminUser(clerkUser.id, email);

        res.json({
            message: "Account created successfully!",
            token: signInToken.token
        });
    } catch (error: any) {
        if (error.errors && error.errors.length > 0) {
            res.status(400).json({ message: error.errors[0].longMessage});
        } else {
            res.status(400).json({ message: "Signup failed!" });
        }
    }
});

router.post("/login", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Missing email!" });
    }

    const updatedUser: User | null = await Database.updateUserLoginDate(email);
    if (updatedUser) {
        res.json({
            message: "Updated login date successfully!",
            user: updatedUser
        });
    }
    else {
        res.status(400).json({ message: "Failed to update the login date!" });
    }
});

export default router;