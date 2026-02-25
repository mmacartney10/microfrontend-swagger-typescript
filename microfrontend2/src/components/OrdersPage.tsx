import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../services/api";
import { Order, OrderInput } from "@swagger-ts/api-client";

const OrdersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Fetch all orders
  const {
    data: orders,
    isLoading: loadingOrders,
    error: ordersError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: () => apiClient.ordersService.ordersList(),
  });

  // Fetch specific order details
  const { data: selectedOrder, isLoading: loadingOrder } = useQuery({
    queryKey: ["order", selectedOrderId],
    queryFn: () =>
      apiClient.ordersService.ordersDetail({ id: selectedOrderId! }),
    enabled: !!selectedOrderId,
  });

  // Create order mutation
  const createOrderMutation = useMutation({
    mutationFn: (newOrder: OrderInput) =>
      apiClient.ordersService.ordersCreate(newOrder),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const handleCreateOrder = () => {
    const newOrder: OrderInput = {
      customerId: "cust_microfrontend",
      customerName: "Microfrontend User",
      items: [
        { productId: "1", quantity: 2, price: 199.99 },
        { productId: "2", quantity: 1, price: 89.99 },
      ],
      total: 489.97,
      shippingAddress: "123 Microfrontend St, React City, TS 12345",
      estimatedDelivery: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
      ).toISOString(), // 7 days from now
    };
    createOrderMutation.mutate(newOrder);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "pending":
        return "#F59E0B";
      case "processing":
        return "#3B82F6";
      case "shipped":
        return "#10B981";
      case "delivered":
        return "#059669";
      case "cancelled":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  if (loadingOrders) return <div>Loading orders...</div>;
  if (ordersError)
    return <div>Error loading orders: {ordersError.message}</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>📦 Orders Management</h2>

      <button
        onClick={handleCreateOrder}
        disabled={createOrderMutation.isPending}
        style={{
          backgroundColor: "#8B5CF6",
          color: "white",
          border: "none",
          padding: "10px 20px",
          borderRadius: "5px",
          marginBottom: "20px",
        }}
      >
        {createOrderMutation.isPending ? "Creating..." : "Create Test Order"}
      </button>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}
      >
        {/* Orders List */}
        <div>
          <h3>All Orders</h3>
          <div style={{ display: "grid", gap: "10px" }}>
            {orders?.data?.map((order) => (
              <div
                key={order.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "15px",
                  cursor: "pointer",
                  backgroundColor:
                    selectedOrderId === order.id ? "#f0f9ff" : "white",
                }}
                onClick={() => setSelectedOrderId(order.id!)}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <h4 style={{ margin: "0" }}>Order #{order.id}</h4>
                  <span
                    style={{
                      backgroundColor: getStatusColor(order.status),
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      fontSize: "0.9em",
                      textTransform: "capitalize",
                    }}
                  >
                    {order.status}
                  </span>
                </div>

                <p style={{ margin: "0 0 10px 0", color: "#666" }}>
                  <strong>{order.customerName}</strong> (ID: {order.customerId})
                </p>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: "1.2em",
                      fontWeight: "bold",
                      color: "#3B82F6",
                    }}
                  >
                    ${order.total}
                  </span>
                  <span style={{ fontSize: "0.9em", color: "#666" }}>
                    {order.items?.length} items
                  </span>
                </div>

                {order.orderDate && (
                  <div
                    style={{
                      fontSize: "0.8em",
                      color: "#666",
                      marginTop: "5px",
                    }}
                  >
                    Ordered: {new Date(order.orderDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div>
          <h3>Order Details</h3>
          {selectedOrderId ? (
            loadingOrder ? (
              <div>Loading order details...</div>
            ) : selectedOrder?.data ? (
              <div
                style={{
                  border: "2px solid #8B5CF6",
                  borderRadius: "8px",
                  padding: "20px",
                  backgroundColor: "#faf9ff",
                }}
              >
                <div style={{ marginBottom: "15px" }}>
                  <h3>Order #{selectedOrder.data.id}</h3>
                  <span
                    style={{
                      backgroundColor: getStatusColor(
                        selectedOrder.data.status,
                      ),
                      color: "white",
                      padding: "6px 12px",
                      borderRadius: "8px",
                      textTransform: "capitalize",
                    }}
                  >
                    {selectedOrder.data.status}
                  </span>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <h4>Customer Information</h4>
                  <p>
                    <strong>Name:</strong> {selectedOrder.data.customerName}
                  </p>
                  <p>
                    <strong>ID:</strong> {selectedOrder.data.customerId}
                  </p>
                  <p>
                    <strong>Shipping Address:</strong>{" "}
                    {selectedOrder.data.shippingAddress}
                  </p>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <h4>Order Items</h4>
                  {selectedOrder.data.items?.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "white",
                        padding: "10px",
                        marginBottom: "5px",
                        borderRadius: "4px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>
                        Product #{item.productId} × {item.quantity}
                      </span>
                      <span>${item.price?.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "1.2em",
                      fontWeight: "bold",
                    }}
                  >
                    <span>Total:</span>
                    <span style={{ color: "#8B5CF6" }}>
                      ${selectedOrder.data.total}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: "0.9em", color: "#666" }}>
                  {selectedOrder.data.orderDate && (
                    <p>
                      Order Date:{" "}
                      {new Date(selectedOrder.data.orderDate).toLocaleString()}
                    </p>
                  )}
                  {selectedOrder.data.estimatedDelivery && (
                    <p>
                      Estimated Delivery:{" "}
                      {new Date(
                        selectedOrder.data.estimatedDelivery,
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ) : null
          ) : (
            <div
              style={{
                border: "1px dashed #ddd",
                borderRadius: "8px",
                padding: "40px",
                textAlign: "center",
                color: "#666",
              }}
            >
              Select an order to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
