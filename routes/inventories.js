const express = require("express");
const router = express.Router();
const fs = require("node:fs");
const invecontrol=require("../controllers/02_invecontrol")




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
            return knex("inventories").where({ id: result[0] });
          })
          .then((response) => {
            res.status(201).json(response);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    });
}

router.patch("/:id", editInventoryItem);

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

router.delete("/:id", deleteInventoryItem);

router.get("/", getInventories);
router.get("/:id", getItemDetail);

router.post("/", postInventories);
=======
router.delete("/:id", invecontrol.deleteInventoryItem);

router.get("/", invecontrol.getInventories);
router.get("/:id", invecontrol.getItemDetail);
router.patch("/:id",invecontrol.editInventoryItem)
router.post("/", invecontrol.postInventories);

module.exports = router;
