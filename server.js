const errorHandler = require("./src/middlewares/errorHandler");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./src/config/db");

const app = express();

const userRoutes = require("./src/routes/user.routes");
const genreRoutes = require("./src/routes/genre.routes");
const packagesRoutes = require("./src/routes/packages.routes");
const seriesRoutes = require("./src/routes/series.routes");
const episodesRoutes = require("./src/routes/episodes.routes");
const daftarSayaRoutes = require("./src/routes/daftarSaya.routes");
const orderRoutes = require("./src/routes/order.routes");
const pembayaranRoutes = require("./src/routes/pembayaran.routes");
const authRoutes = require("./src/routes/auth.routes");
const uploadRoutes = require("./src/routes/upload.routes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Chill App API is running",
  });
});

app.use("/users", userRoutes);
app.use("/genres", genreRoutes);
app.use("/packages", packagesRoutes);
app.use("/series", seriesRoutes);
app.use("/episodes", episodesRoutes);
app.use("/daftar-saya", daftarSayaRoutes);
app.use("/orders", orderRoutes);
app.use("/pembayaran", pembayaranRoutes);
app.use("/", authRoutes);
app.use("/upload", uploadRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
