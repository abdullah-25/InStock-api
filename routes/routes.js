const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile"));
const warecontrol=require("../controllers/01_warecontrol")
router.get("/", warecontrol.getWarehouses);
router.get("/:id", warecontrol.getWarehouseDetail);
router.patch("/:id", warecontrol.editWarehouse);
router.get("/:id/inventories", warecontrol.getInventoryfromWarehouse);
router.route("/:id").get(warecontrol.getWarehouseDetail);
router.delete("/:id", warecontrol.deleteWarehouse);
router.post("/", warecontrol.postWarehouse);
module.exports = router;
