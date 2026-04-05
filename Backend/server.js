const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: [
        "https://college-voting-application.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    credentials: true,
}));

// Database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("MongoDB connection error:", err));

// Health check routes
app.get("/", (req, res) => {
    res.json({
        status: "✅ College Voting API is running",
        version: "1.0.0",
        endpoints: "/api/auth | /api/votes | /api/users | /api/candidates | /api/announcements | /api/notifications | /api/activity | /api/election-requests"
    });
});
app.get("/api/health", (req, res) => res.json({ status: "ok", uptime: process.uptime() }));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/votes", require("./routes/voteRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/announcements", require("./routes/announcementRoutes"));
app.use("/api/activity", require("./routes/activityRoutes"));
app.use("/api/candidates", require("./routes/candidateRoutes"));
app.use("/api/election-requests", require("./routes/electionRequestRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});