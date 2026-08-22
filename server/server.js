import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "liftmetrics-api" });
});

app.listen(PORT, () => {
  console.log(`Liftmetrics API running on http://localhost:${PORT}`);
});