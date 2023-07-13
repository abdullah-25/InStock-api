const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile"));
function getWarehouses(req, res) {
  knex("warehouses")
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      res.status(400).send(`error on retrieve warehouses ${error}`);
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

function editWarehouse(res, req) {
  knex("warehouses")
    .where({ id: req.params.id })
    .update(req.body)
    .then(() => {
      return knex("warehouses").where({
        id: req.params.id,
      });
    })
    .then((updatedWarehouse) => {
      res.json(updatedWarehouse[0]);
    })
    .catch(() => {
      res.status(500).json({
        message: `Warehouse with ID: ${req.params.id} unable to updated`,
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

function postWarehouse(req, res) {
  const {
    warehouseName,
    warehouseAddress,
    warehouseCountry,
    warehouseCity,
    ContactName,
    ContactPosition,
    ContactPhone,
    ContactEmail,
  } = req.body;

  const phoneno = /^\d{10}$/;
  const regex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (
    !warehouseName ||
    !warehouseAddress ||
    !warehouseCountry ||
    !warehouseCity ||
    !ContactName ||
    !ContactPosition ||
    !ContactPhone ||
    !ContactEmail
  ) {
    return res.status(400).send("Missing Properties");
  }

  if (!ContactPhone.match(phoneno) || !ContactEmail.match(regex)) {
    return res.status(400).send("Invalid Phone or Email Address");
  }

  const newWarehouse = {
    warehouseName,
    warehouseAddress,
    warehouseCountry,
    warehouseCity,
    ContactName,
    ContactPosition,
    ContactPhone,
    ContactEmail,
  };

  knex("warehouses")
    .insert(newWarehouse)
    .then(() => {
      res.status(200);
    });
}

router.get("/", getWarehouses);
router.route("/:id").get(getWarehouseDetail);
router.patch("/:id", editWarehouse);
router.delete("/:id", deleteWarehouse);
router.post("/", postWarehouse);
module.exports = router;
