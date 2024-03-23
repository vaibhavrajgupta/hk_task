import express from "express";
import cookieParser from "cookie-parser";
import compression from "compression";
import dotenv from "dotenv";

const app = express();

dotenv.config({
	path: "./env",
});

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cookieParser());
dotenv.config();         

import apis from "../infrastructure/routes/index.js"

app.use("/api", apis);

export default app;
