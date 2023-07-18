const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile"));


function getWarehouses(req, res) {
  const { sort_by } = req.query;
  let warehousesQuery = knex("warehouses");

  if (sort_by) {
    const [column, order] = sort_by.split(" ");
    warehousesQuery = warehousesQuery.orderBy(
      column,
      order === "ACS" ? "asc" : "desc"
    );
  }

  warehousesQuery
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(400).send(`Error retrieving warehouses: ${error}`);
    });
}



const warecontrol=require("../controllers/01_warecontrol")
router.get("/", getWarehouses);
router.get("/:id", warecontrol.getWarehouseDetail);
router.patch("/:id", warecontrol.editWarehouse);
router.get("/:id/inventories", warecontrol.getInventoryfromWarehouse);
router.route("/:id").get(warecontrol.getWarehouseDetail);
router.delete("/:id", warecontrol.deleteWarehouse);
router.post("/", warecontrol.postWarehouse);

module.exports = router;
