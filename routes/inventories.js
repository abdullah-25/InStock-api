const express = require("express");
const { v4 } = require("uuid");
const router = express.Router();
const fs = require("node:fs");
const invecontrol=require("../controllers/02_invecontrol")



router.delete("/:id", invecontrol.deleteInventoryItem);

router.get("/", invecontrol.getInventories);
router.get("/:id", invecontrol.getItemDetail);
router.patch("/:id",invecontrol.editInventoryItem)
router.post("/", invecontrol.postInventories);
module.exports = router;
