const express = require("express");
const { v4 } = require("uuid");
const router = express.Router();
const fs = require("node:fs");
const knex = require("knex")(require("../knexfile"));
function getWarehouses(req, res) {
  knex("warehouses")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.staus(400).send(`error on retrieve warehouses ${error}`);
    });
}
function getWarehouseDetail(req, res) {
  knex("warehouses")
    .where({ id: req.params.id })
    .then((warehouseFound) => {
      if (warehouseFound.length === 0) {
        return res
          .status(404)
          .json({ message: `warehouse with ID ${req.params.id} not found` });
      }
      const warehouseData = warehouseFound[0];
      res.status(200).json(warehouseData);
    })
    .catch((error) => {
      res.status(500).json({
        message: `unable to retrieve warehouse with ID ${req.params.id}`,
      });
    });
}

function deleteWarehouse(req, res) {
  knex("warehouses")
    .where({ id: req.params.id })
    .del()
    .then((result) => {
      if (result === 0) {
        return res.status(400).json({
          message: `Warehouse ID: ${req.params.id} not found. Cannot be deleted`,
        });
      }
      res.status(204).send();
    })
    .catch(() => {
      res.status(500).json({ message: "Unable to delete Warehouse" });
    });
}

router.get("/", getWarehouses);
router.route("/:id").get(getWarehouseDetail);
router.delete("/:id", deleteWarehouse);
module.exports = router;
