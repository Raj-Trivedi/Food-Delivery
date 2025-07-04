import express from "express";
import { createOrder, getAllOrders, getUserOrders, updateOrderStatus, deleteOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/add", createOrder);
orderRouter.get("/", getAllOrders);
orderRouter.get("/user/:user", getUserOrders);
orderRouter.patch("/:id/status", updateOrderStatus);
orderRouter.delete("/:id", deleteOrder);

export { orderRouter }; 