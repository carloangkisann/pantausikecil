import express, { Request, Response } from "express";
import { ENV } from "./config/env";

const app = express();
const PORT = ENV.PORT;

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ success: true });
});

app;
app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
});
