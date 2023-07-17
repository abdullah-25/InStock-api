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
      order === "ACS" ? "warehouse_name ACS" : "warehouse_name DESC"
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

// function getWarehouses(req, res) {
//   knex("warehouses")
//     .then((data) => {
//       res.status(200).json(data);
//     })
//     .catch((error) => {
//       res.status(400).send(`error on retrieve warehouses ${error}`);
//     });
// }
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

function editWarehouse(req, res) {
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

  const editWarehouse = {
    warehouse_name: warehouseName,
    address: warehouseAddress,
    country: warehouseCountry,
    city: warehouseCity,
    contact_name: ContactName,
    contact_position: ContactPosition,
    contact_phone: ContactPhone,
    contact_email: ContactEmail,
  };

  knex("warehouses")
    .where({ id: req.params.id })
    .update(editWarehouse)
    .then(() => {
      res.status(200).send("updated");
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

  const phoneno = /^\+\d{1}\s\(\d{3}\)\s\d{3}-\d{4}$/;
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
    warehouse_name: warehouseName,
    address: warehouseAddress,
    country: warehouseCountry,
    city: warehouseCity,
    contact_name: ContactName,
    contact_position: ContactPosition,
    contact_phone: ContactPhone,
    contact_email: ContactEmail,
  };
  console.log(newWarehouse);

  knex("warehouses")
    .insert(newWarehouse)
    .then(() => {
      res.status(200);
    });
}
function getInventoryfromWarehouse(req, res) {
  knex("inventories")
    .where({ warehouse_id: req.params.id })
    .then((response) => {
      return res.status(200).send(response);
    })
    .catch((response) => {
      return res.status(404).send("Internal Server Error");
    });
}
router.get("/", getWarehouses);
router.get("/:id", getWarehouseDetail);
router.patch("/:id", editWarehouse);
router.get("/:id/inventories", getInventoryfromWarehouse);
router.route("/:id").get(getWarehouseDetail);
router.delete("/:id", deleteWarehouse);
router.post("/", postWarehouse);
module.exports = router;
