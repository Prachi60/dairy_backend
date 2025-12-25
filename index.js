import express from "express";
import dotenv from "dotenv";
import connectDB from "./app/dbConfig/dbConfig.js";
import setupRoutes from "./app/routes/index.js";
import mediaSetup from "./app/routes/media.js";
import path from "path";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOSTNAME || "0.0.0.0";

app.use(
  cors({
    origin: ["http://localhost:5173",
     "https://admin-pannel-subsify.vercel.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
connectDB();
setupRoutes(app);
mediaSetup(app);
app.use("/media", express.static(path.join(process.cwd(), "uploads")));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
