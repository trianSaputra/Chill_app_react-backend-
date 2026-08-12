const express = require("express");
const orderController = require("../controllers/order.controller");

const router = express.Router();

router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.post("/", orderController.createOrder);
router.patch("/:id/cancel", orderController.cancelOrder);

module.exports = router;
