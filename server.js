const errorHandler = require("./src/middlewares/errorHandler");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./src/config/db");

const app = express();

const userRoutes = require("./src/routes/user.routes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Chill App API is running",
  });
});

app.use("/users", userRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
