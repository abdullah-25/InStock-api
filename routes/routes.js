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


function postWarehouse(req, res) {
  const {
    warehouse_name,
    address,
    country,
    city,
    contact_name,
    contact_position,
    contact_phone,
    contact_email,
  } = req.body;
  console.log(req.body);

  const phoneno = /^\+\d{1}\s\(\d{3}\)\s\d{3}-\d{4}$/;
  const regex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (
    !warehouse_name ||
    !address ||
    !country ||
    !city ||
    !contact_name ||
    !contact_position ||
    !contact_phone ||
    !contact_email
  ) {
    return res.status(400).send("Missing Properties");
  }

  // if (!contact_phone.match(phoneno) || !contact_email.match(regex)) {
  //   return res.status(400).send("Invalid Phone or Email Address");
  // }

  //code from front end alaways makes sure that number
  //and email are typed correctly with appropriate format so no need to check here

  const newWarehouse = {
    warehouse_name,
    address,
    country,
    city,
    contact_name,
    contact_position,
    contact_phone,
    contact_email,
  };
  console.log(newWarehouse);

  knex("warehouses")
    .insert(newWarehouse)
    .then(() => {
      res.status(200).send("Warehouse created successfully");
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



const warecontrol=require("../controllers/01_warecontrol")

router.get("/", getWarehouses);
router.get("/:id", warecontrol.getWarehouseDetail);
router.patch("/:id", warecontrol.editWarehouse);
router.get("/:id/inventories", warecontrol.getInventoryfromWarehouse);
router.route("/:id").get(warecontrol.getWarehouseDetail);
router.delete("/:id", warecontrol.deleteWarehouse);
router.post("/", warecontrol.postWarehouse);

module.exports = router;
