import React, { useState } from "react";
import {
  OrderInput,
  useOrdersList,
  useOrdersCreate,
  useOrdersDetail,
} from "@swagger-ts/api-client";
import { ordersService } from "../services/api";

const OrderManager: React.FC = () => {
  const { data: orders, isLoading, error } = useOrdersList(ordersService);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const { data: selectedOrder } = useOrdersDetail(ordersService, {
    id: selectedOrderId,
  });
  const createOrder = useOrdersCreate(ordersService);

  const handleCreateOrder = () => {
    const newOrder: OrderInput = {
      customerId: `cust_${Date.now()}`,
      customerName: `Customer ${Math.floor(Math.random() * 1000)}`,
      items: [
        {
          productId: `prod_${Math.floor(Math.random() * 100)}`,
          quantity: Math.floor(Math.random() * 5) + 1,
          price: Math.floor(Math.random() * 50) + 10,
        },
      ],
      total: Math.floor(Math.random() * 200) + 50,
      shippingAddress: "123 Demo Street, Test City, TC 12345",
    };
    createOrder.mutate(newOrder);
  };

  if (isLoading) return <div>Loading orders...</div>;
  if (error) return <div>Error loading orders: {String(error)}</div>;

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>📦 Order Manager</h3>
      <button
        onClick={handleCreateOrder}
        disabled={createOrder.isPending}
        style={{
          marginBottom: "10px",
          padding: "5px 10px",
          backgroundColor: "#4caf50",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        {createOrder.isPending ? "Creating..." : "Create New Order"}
      </button>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <h4>Orders List ({orders?.data?.length || 0})</h4>
          <div style={{ overflowY: "auto" }}>
            {orders?.data?.map((order) => (
              <div
                key={order.id}
                style={{
                  padding: "8px",
                  border: "1px solid #ccc",
                  margin: "5px 0",
                  cursor: "pointer",
                  backgroundColor:
                    selectedOrderId === order.id ? "#e6f3ff" : "white",
                }}
                onClick={() => setSelectedOrderId(order.id || "")}
              >
                <strong>#{order.id?.slice(-8)}</strong> - {order.customerName}
                <div style={{ fontSize: "12px", color: "#666" }}>
                  ${order.total} • {order.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h4>Order Details</h4>
          {selectedOrder?.data ? (
            <div
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h5>Order #{selectedOrder.data.id?.slice(-8)}</h5>
              <p>
                <strong>Customer:</strong> {selectedOrder.data.customerName}
              </p>
              <p>
                <strong>Total:</strong> ${selectedOrder.data.total}
              </p>
              <p>
                <strong>Status:</strong> {selectedOrder.data.status}
              </p>
              <p>
                <strong>Items:</strong> {selectedOrder.data.items?.length}
              </p>
            </div>
          ) : (
            <p>Select an order to see details</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderManager;
