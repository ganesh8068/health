const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://health-pxmo.onrender.com",
];
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/appointments", appointmentRoutes);

app.get("/", (req, res) => {
  res.send("MediTrack API is running...");
});

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/meditrack";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    const server = app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`),
    );

    server.on("error", (err) => {
      if (err && err.code === "EADDRINUSE") {
        console.error(
          `Port ${PORT} is already in use. Free the port or set a different PORT in environment.`,
        );
        process.exit(1);
      } else {
        console.error("Server error:", err);
        process.exit(1);
      }
    });
  })
  .catch((err) => console.log("Database Connection Error:", err));
