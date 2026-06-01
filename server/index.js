const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const pool = require("./config/db");

app.use(express.json());

app.get("/", async (req, res) => {
  const time = await pool.query("SELECT NOW()");
  res.send(`Neighborly API running - DB connected at ${time.rows[0].now}`);
});


app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);


app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

const authMiddleware = require("./middleware/authMiddleware");

app.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "You are authenticated", user: req.user });
});
console.log("JWT:", process.env.JWT_SECRET);


const requestRoutes = require("./routes/requestRoutes");
app.use("/api/request", requestRoutes);


const ratingRoutes = require("./routes/ratingRoutes");
app.use("/api/rating", ratingRoutes);
