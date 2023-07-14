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
function postInventories(req, res) {
  const { warehouse_id, item_name, description, category, status, quantity } =
    req.body;
  if (
    !warehouse_id ||
    !item_name ||
    !description ||
    !category ||
    !status ||
    !quantity
  ) {
    return res.status(400).send("Missing Properties");
  }
  if (isNaN(Number(quantity))) {
    return res.status(400).send("Quantity must be a number");
  }



  //   return res.send('ok')

  knex("warehouses")
    .where({ id: req.body.warehouse_id })
    .then((result) => {
      if (result.length === 0) {
        return res.status(400).json({
          message: `Warehouse ID: ${req.body.warehouse_id} not found.`,
        });
      } else {

    
        const newInventories = {
          warehouse_id,
          item_name,
          description,
          category,
          status,
          quantity,
        };
        knex("inventories")
          .insert(newInventories)
          .then((result) => {
            return knex("inventories")
            .where({id:result[0]})
          })
          .then((response)=>{
            res.status(201).json(response);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });
}
router.get("/", getInventories);
router.get("/:id", getItemDetail);
router.post("/", postInventories);
module.exports = router;
