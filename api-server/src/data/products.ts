export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  imageUrl?: string;
  tags: string[];
  createdAt: string;
}

export const productsData: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 199.99,
    category: "Electronics",
    inStock: true,
    imageUrl: "/images/headphones.jpg",
    tags: ["audio", "wireless", "electronics"],
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Coffee Maker",
    description: "Programmable coffee maker with thermal carafe",
    price: 89.99,
    category: "Appliances",
    inStock: true,
    tags: ["kitchen", "appliances", "coffee"],
    createdAt: "2026-01-20T15:30:00Z",
  },
  {
    id: "3",
    name: "Running Shoes",
    description: "Lightweight running shoes with cushioned sole",
    price: 129.99,
    category: "Sports",
    inStock: false,
    tags: ["shoes", "running", "sports"],
    createdAt: "2026-02-01T09:15:00Z",
  },
];
