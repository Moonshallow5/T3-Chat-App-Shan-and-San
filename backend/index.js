const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Parse JSON requests

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// Auth routes
app.use('/auth',require("./routes/authRoutes"));


app.listen(port, () => console.log(`Server running on port ${port}`));