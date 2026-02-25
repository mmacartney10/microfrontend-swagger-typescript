export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: string;
  orderDate: string;
  estimatedDelivery?: string;
}

export const ordersData: Order[] = [
  {
    id: "1",
    customerId: "cust_123",
    customerName: "Alice Johnson",
    items: [
      { productId: "1", quantity: 1, price: 199.99 },
      { productId: "2", quantity: 2, price: 89.99 },
    ],
    total: 379.97,
    status: "shipped",
    shippingAddress: "123 Main St, Anytown, ST 12345",
    orderDate: "2026-02-18T14:30:00Z",
    estimatedDelivery: "2026-02-22T00:00:00Z",
  },
  {
    id: "2",
    customerId: "cust_456",
    customerName: "Bob Smith",
    items: [{ productId: "3", quantity: 1, price: 129.99 }],
    total: 129.99,
    status: "processing",
    shippingAddress: "456 Oak Ave, Somewhere, ST 67890",
    orderDate: "2026-02-19T09:15:00Z",
    estimatedDelivery: "2026-02-25T00:00:00Z",
  },
];
