import React, { useState } from "react";
import {
  useOrdersList,
  useCreateOrders,
  useOrdersDetail,
  useUsersList,
  useCreateUsers,
  useUpdateUsers,
  User,
  OrderInput,
  UserInput,
} from "@swagger-ts/api-client";
import { ordersService, usersService } from "../services/api";

const OrderUserManager: React.FC = () => {
  const { data: orders, isLoading: ordersLoading } =
    useOrdersList(ordersService);
  const { data: users, isLoading: usersLoading } = useUsersList(usersService);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const { data: selectedOrder } = useOrdersDetail(
    ordersService,
    selectedOrderId,
  );

  const createOrder = useCreateOrders(ordersService);
  const createUser = useCreateUsers(usersService);
  const updateUser = useUpdateUsers(usersService);

  const handleCreateOrder = () => {
    const newOrder: OrderInput = {
      customerId: `cust_${Date.now()}`,
      customerName: `Customer ${Math.floor(Math.random() * 1000)}`,
      items: [
        {
          productId: `prod_${Math.floor(Math.random() * 100)}`,
          quantity: Math.floor(Math.random() * 3) + 1,
          price: Math.floor(Math.random() * 100) + 20,
        },
      ],
      total: Math.floor(Math.random() * 300) + 50,
      shippingAddress: "123 MF3 Street, Demo City, DC 12345",
    };
    createOrder.mutate(newOrder);
  };

  const handleCreateUser = () => {
    const roles: ("admin" | "user" | "moderator")[] = [
      "user",
      "moderator",
      "admin",
    ];
    const newUser: UserInput = {
      username: `mf3user_${Date.now()}`,
      email: `mf3user${Math.floor(Math.random() * 1000)}@example.com`,
      firstName: "MF3",
      lastName: "User",
      role: roles[Math.floor(Math.random() * roles.length)],
    };
    createUser.mutate(newUser);
  };

  const handlePromoteUser = (user: User) => {
    if (user.id) {
      const newRole =
        user.role === "user"
          ? "moderator"
          : user.role === "moderator"
            ? "admin"
            : "user";
      const updatedUser: UserInput = {
        username: user.username || "",
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        role: newRole,
        active: user.active,
      };
      updateUser.mutate({ id: user.id, user: updatedUser });
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>📦 Order & User Manager</h3>

      <div style={{ display: "flex", gap: "20px" }}>
        {/* Orders Section */}
        <div style={{ flex: 1 }}>
          <h4>Orders ({orders?.data?.length || 0})</h4>
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
              fontSize: "12px",
            }}
          >
            {createOrder.isPending ? "Creating..." : "New Order"}
          </button>

          {ordersLoading ? (
            <div>Loading orders...</div>
          ) : (
            <div style={{ maxHeight: "120px", overflowY: "auto" }}>
              {orders?.data?.slice(0, 4).map((order) => (
                <div
                  key={order.id}
                  style={{
                    padding: "6px",
                    border: "1px solid #ccc",
                    margin: "3px 0",
                    cursor: "pointer",
                    backgroundColor:
                      selectedOrderId === order.id ? "#e8f5e8" : "white",
                    fontSize: "11px",
                  }}
                  onClick={() => setSelectedOrderId(order.id || "")}
                >
                  <strong>#{order.id?.slice(-6)}</strong> - {order.customerName}
                  <div>
                    ${order.total} • {order.status}
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedOrder?.data && (
            <div
              style={{
                marginTop: "10px",
                padding: "8px",
                backgroundColor: "#f0f8ff",
                borderRadius: "4px",
                fontSize: "11px",
              }}
            >
              <strong>Order Details:</strong>
              <div>Customer: {selectedOrder.data.customerName}</div>
              <div>Total: ${selectedOrder.data.total}</div>
              <div>Items: {selectedOrder.data.items?.length}</div>
            </div>
          )}
        </div>

        {/* Users Section */}
        <div style={{ flex: 1 }}>
          <h4>Users ({users?.data?.length || 0})</h4>
          <button
            onClick={handleCreateUser}
            disabled={createUser.isPending}
            style={{
              marginBottom: "10px",
              padding: "5px 10px",
              backgroundColor: "#2196f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
            }}
          >
            {createUser.isPending ? "Creating..." : "New User"}
          </button>

          {usersLoading ? (
            <div>Loading users...</div>
          ) : (
            <div style={{ maxHeight: "120px", overflowY: "auto" }}>
              {users?.data?.slice(0, 4).map((user) => (
                <div
                  key={user.id}
                  style={{
                    padding: "6px",
                    border: "1px solid #ccc",
                    margin: "3px 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "11px",
                  }}
                >
                  <div>
                    <strong>
                      {user.firstName} {user.lastName}
                    </strong>
                    <div style={{ color: "#666" }}>{user.role}</div>
                  </div>
                  <button
                    onClick={() => handlePromoteUser(user)}
                    style={{
                      padding: "2px 6px",
                      fontSize: "10px",
                      backgroundColor: "#ff9800",
                      color: "white",
                      border: "none",
                      borderRadius: "3px",
                      cursor: "pointer",
                    }}
                  >
                    Promote
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderUserManager;
