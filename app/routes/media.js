import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.resolve(__dirname, "../../uploads");

export default (app) => {
  router.get("/media/:name", (req, res) => {
    try {
      const { name } = req.params;

      if (name.includes("..")) {
        return res.status(400).json({ error: "Invalid file name" });
      }

      const filePath = path.join(uploadsDir, name);

      const normalized = path.normalize(filePath);
      if (!normalized.startsWith(uploadsDir)) {
        return res.status(400).json({ error: "Invalid file path" });
      }

      res.sendFile(normalized, (err) => {
        if (err) {
          console.error("sendFile error:", err, "tried path:", normalized);
          return res.status(404).json({ error: "File not found" });
        }
      });
    } catch (error) {
      console.error("media route error:", error);
      return res.status(500).json({ error: error.message });
    }
  });

  app.use("/", router);
};
