import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import matchRoutes from "./routes/match.routes.js";

const app = express();
dotenv.config();

app.use(cors({origin: process.env.CLIENT_URL, credentials: true}));
app.use(cookieParser());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
    res.send("SkillSwap API is running...");
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/match', matchRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});