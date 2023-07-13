const express = require("express");
const { v4 } = require("uuid");
const router = express.Router();
const fs = require("node:fs");
const knex = require('knex')(require('../knexfile'));

function getInventories(req, res){
    knex.raw("select warehouse_name, inventories.* from warehouses left join inventories on warehouses.id = inventories.warehouse_id;").then((response) => {
        return res.status(200).send(response);
    }).catch((response) => {
        console.log(response);
        return res.status(503).send("No inventories found");
    })
}
router.get('/', getInventories);
module.exports = router;
