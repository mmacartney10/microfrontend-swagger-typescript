import { Request, Response } from "express";
import { ordersData, Order } from "../../data/orders";

const getOrders = (request: Request, response: Response): void => {
  console.log("getOrders");
  response.status(200).json(ordersData);
};

const postOrder = (request: Request, response: Response): void => {
  console.log("postOrder", request.body);

  try {
    const newOrder: Order = {
      id: String(ordersData.length + 1),
      ...request.body,
      orderDate: new Date().toISOString(),
      status: "pending",
    } as Order;

    ordersData.push(newOrder);
    response.status(201).json(newOrder);
  } catch (error) {
    response.status(400).json({ error: "Invalid order data" });
  }
};

const getOrder = (request: Request, response: Response): void => {
  const { id } = request.params;
  console.log("getOrder", id);

  const order = ordersData.find((o) => o.id === id);
  if (!order) {
    response.status(404).json({ error: "Order not found" });
    return;
  }

  response.status(200).json(order);
};

const updateOrderStatus = (request: Request, response: Response): void => {
  const { id } = request.params;
  const { status } = request.body;
  console.log("updateOrderStatus", id, status);

  const orderIndex = ordersData.findIndex((o) => o.id === id);
  if (orderIndex === -1) {
    response.status(404).json({ error: "Order not found" });
    return;
  }

  const validStatuses = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];
  if (!validStatuses.includes(status)) {
    response.status(400).json({ error: "Invalid status value" });
    return;
  }

  ordersData[orderIndex] = {
    ...ordersData[orderIndex],
    status,
  };

  response.status(200).json(ordersData[orderIndex]);
};

export { getOrders, postOrder, getOrder, updateOrderStatus };
