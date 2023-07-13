require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const warehouseRoute = require("./routes/warehouses");
const inventoryRoute = require("./routes/inventories");
const PORT = process.env.PORT || 5050;

// middleware
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.static("public"));

// register routes
app.use("/api/warehouses", warehouseRoute);
app.use("/api/inventories", inventoryRoute);

// go!!
app.listen(PORT, () => {
  console.log("server started on port", PORT);
});
