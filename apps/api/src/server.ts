import app from "./app";
import mongoose from "mongoose";

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/snippets")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`API running on port ${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error", err));
