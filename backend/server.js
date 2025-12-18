require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
// const tipsRoutes = require("./routes/tipsRoutes");
const tipsRoutes = require("./routes/tipsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());

const path = require("path");

// ✅ TEST ROUTE
app.get("/api", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Backend is running",
    timestamp: new Date().toISOString(),
  });
});



app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/auth", authRoutes);
app.use("/api/tip", tipsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);
app.use("/api/activity", require("./routes/activityRoutes"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log("Server running on port 5000");
});
