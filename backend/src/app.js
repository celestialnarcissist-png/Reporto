import express from "express";
const app = express();
import cookieParser from "cookie-parser";

app.use(
  cors({
    origin: "*",
    credentials: "true",
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(cookieParser());

export { app };
