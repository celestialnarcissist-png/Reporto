import { DB_NAME } from "../constants.js";
import express from "express";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const responseDB = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log("DB connected at : ", responseDB.connection.host);
  } catch (error) {
    console.log("DB couldnt be connected ", error);

    process.exit(1);
  }
};

export { connectDB };
