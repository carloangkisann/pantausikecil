import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { ENV } from "./config/env";
import { errorHandler, notFound } from "./middleware/errorHandler";

// Import routes
import authRoutes from "./routes/auth";
import profileRoutes from "./routes/profile";
import nutritionRoutes from "./routes/nutrition";
import activityRoutes from "./routes/activity";
import emergencyRoutes from "./routes/emergency";
import dashboardRoutes from "./routes/dashboard";
import aiRoutes from "./routes/ai";

const app = express();
const PORT = ENV.PORT;

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for API
  })
);

// // CORS configuration
// app.use(cors({
//   origin: process.env.NODE_ENV === 'production'
//     ? ['https://your-frontend-domain.com'] // Replace with your actual frontend domain(s)
//     : ['http://localhost:3000', 'http://localhost:3001'], // Local development
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// }));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Rate limiting
const limiter = rateLimit({
  windowMs: ENV.RATE_LIMIT_WINDOW_MS, // 15 minutes
  max: ENV.RATE_LIMIT_MAX, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to all requests
app.use(limiter);

// Compression middleware
app.use(compression());

// Health check endpoint
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "PantauSiKecil API is running",
    timestamp: new Date().toISOString(),
    environment: ENV.NODE_ENV,
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", profileRoutes);
app.use("/api/users", dashboardRoutes);
app.use("/api/users", nutritionRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/users", activityRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/users", emergencyRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/ai", aiRoutes);
console.log("✔️  /api/ai routes registered");

// API documentation endpoint
app.get("/api/docs", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "PantauSiKecil API Documentation",
    version: "1.0.0",
    endpoints: {
      auth: {
        "POST /api/auth/register": "Register new user",
        "POST /api/auth/login": "Login user",
        "GET /api/auth/me": "Get current user info",
        "POST /api/auth/logout": "Logout user",
      },
      profile: {
        "GET /api/users/:user_id/profile": "Get user profile",
        "PUT /api/users/:user_id/profile": "Update user profile",
        "POST /api/users/:user_id/pregnancies": "Create pregnancy record",
        "GET /api/users/:user_id/pregnancies": "Get user pregnancies",
        "PUT /api/users/:user_id/pregnancies/:pregnancy_id":
          "Update pregnancy record",
        "GET /api/users/:user_id/connections": "Get user connections",
        "POST /api/users/:user_id/connections": "Create user connection",
        "DELETE /api/users/:user_id/connections/:connection_id":
          "Delete user connection",
        "POST /api/users/:user_id/reminders": "Create reminder",
      },
      dashboard: {
        "GET /api/users/:user_id/dashboard": "Get user dashboard data",
        "GET /api/users/:user_id/dashboard/weekly": "Get weekly summary",
        "GET /api/users/:user_id/dashboard/nutrition-progress":
          "Get nutrition progress",
        "GET /api/users/:user_id/reminders/upcoming":
          "Get upcoming reminders (3 days from today)",
        "GET /api/users/:user_id/reminders": "Get reminders by date",
        "DELETE /api/users/:user_id/reminders/:reminder_id": "Delete reminder",
      },
      nutrition: {
        "GET /api/users/:user_id/nutrition/needs": "Get nutritional needs",
        "GET /api/users/:user_id/nutrition/today": "Get today's nutrition",
        "GET /api/users/:user_id/nutrition/summary":
          "Get nutrition summary by date",
        "GET /api/users/:user_id/nutrition/meals": "Get user meals by date",
        "POST /api/users/:user_id/nutrition/meals": "Add meal entry",
        "DELETE /api/users/:user_id/nutrition/meals/:meal_id":
          "Remove meal entry",
        "POST /api/users/:user_id/nutrition/water": "Add water intake",
        "GET /api/nutrition/food/:food_id": "Get food details",
        "GET /api/nutrition/food": "Get all food items",
      },
      activity: {
        "GET /api/users/:user_id/activities/today": "Get today's activities",
        "GET /api/users/:user_id/activities/summary":
          "Get activity summary by date",
        "GET /api/users/:user_id/activities/recommended":
          "Get recommended activities",
        "GET /api/users/:user_id/activities/history": "Get activity history",
        "POST /api/users/:user_id/activities": "Add user activity",
        "DELETE /api/users/:user_id/activities/:activity_id":
          "Remove user activity",
        "GET /api/activities/:activity_id": "Get activity details",
        "GET /api/activities": "Get all activities",
        "POST /api/activities/calculate-calories": "Calculate calories",
      },
      emergency: {
        "POST /api/users/:user_id/emergency": "Send emergency notification",
        "GET /api/emergency/test-email": "Test email configuration",
      },
    },
  });
});

app.use(notFound);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("PantauSiKecil API Server is running on PORT:", PORT);
  console.log("API Documentation: http://localhost:" + PORT + "/api/docs");
  console.log("Health Check: http://localhost:" + PORT + "/api/health");
  console.log("Environment:", ENV.NODE_ENV);
});

export default app;
