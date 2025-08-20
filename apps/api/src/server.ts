import mongoose from "mongoose";
import app from "./app";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
console.log(`Starting API on port ${PORT}...`);

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/snippets")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`API running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error", err));
