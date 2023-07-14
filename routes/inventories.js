const express = require("express");
const { v4 } = require("uuid");
const router = express.Router();
const fs = require("node:fs");
const knex = require("knex")(require("../knexfile"));

function getInventories(req, res) {
  knex
    .raw(
      "select warehouse_name, inventories.* from warehouses left join inventories on warehouses.id = inventories.warehouse_id;"
    )
    .then((response) => {
      return res.status(200).send(response);
    })
    .catch((response) => {
      console.log(response);
      return res.status(503).send("No inventories found");
    });
}
function getItemDetail(req, res) {
  knex("inventories")
    .where("id", req.params.id)
    .then((response) => {
      return res.status(200).send(response);
    })
    .catch((error) => {
      console.log(error);
      return res.status(503).send("No item found with that ID");
    });
}

function editInventoryItem(req, res) {
  const itemInfo = req.body;
  if (
    !itemInfo.warehouse_id ||
    !itemInfo.item_name ||
    !itemInfo.description ||
    !itemInfo.category ||
    !itemInfo.status ||
    !itemInfo.quantity
  ) {
    return res
      .status(400)
      .send("400 Error: Needs all properites to be filled. Cat");
  }
  knex("inventories")
    .where({ id: req.params.id })
    .update(req.body)
    .then(() => {
      res.status(200).send("Updated");
    })
    .catch(() => {
      res.status(500).json({
        message: `Item with ID: ${req.params.id} unable to updated`,
      });
    });
}

function deleteInventoryItem(req, res) {
  knex("inventories")
    .where({ id: req.params.id })
    .del()
    .then((result) => {
      if (result === 0) {
        return res.status(400).json({
          message: `Item ID: ${req.params.id} not found. Cannot be deleted`,
        });
      }
      res.status(204).send();
    })
    .catch(() => {
      res.status(500).json({ message: "Unable to delete Inventory Item" });
    });
}

router.get("/", getInventories);
router.get("/:id", getItemDetail);
router.patch("/:id", editInventoryItem);
router.delete("/:id", deleteInventoryItem);
module.exports = router;
