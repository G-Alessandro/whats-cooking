import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import logger from "morgan";
import dotenv from "dotenv";
import indexRouter from "./routes";
dotenv.config();

const allowedFrontendOrigin = process.env.ALLOWED_FRONTEND_ORIGIN;

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: allowedFrontendOrigin,
    credentials: true,
  }),
);

app.use("/", indexRouter);

export default app;
