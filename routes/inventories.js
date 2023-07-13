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
function getItemDetail(req, res){
    knex("inventories").where("id", req.params.id).then(response => {
        return res.status(200).send(response);
    }).catch(error => {
        console.log(error)
        return res.status(503).send("No item found with that ID");
    })
}
router.get('/', getInventories);
router.get('/:id', getItemDetail)
module.exports = router;
