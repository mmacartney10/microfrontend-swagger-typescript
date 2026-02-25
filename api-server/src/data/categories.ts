export interface Category {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  icon?: string;
  color: string;
  productCount: number;
  active: boolean;
  sortOrder: number;
  createdAt: string;
}

export const categoriesData: Category[] = [
  {
    id: "1",
    name: "Electronics",
    description: "Electronic devices and accessories",
    icon: "electronic-chip",
    color: "#3B82F6",
    productCount: 45,
    active: true,
    sortOrder: 1,
    createdAt: "2025-10-01T10:00:00Z",
  },
  {
    id: "2",
    name: "Appliances",
    description: "Home and kitchen appliances",
    icon: "home",
    color: "#10B981",
    productCount: 23,
    active: true,
    sortOrder: 2,
    createdAt: "2025-10-01T10:05:00Z",
  },
  {
    id: "3",
    name: "Sports",
    description: "Sports and fitness equipment",
    icon: "basketball",
    color: "#F59E0B",
    productCount: 67,
    active: true,
    sortOrder: 3,
    createdAt: "2025-10-01T10:10:00Z",
  },
  {
    id: "4",
    name: "Books",
    description: "Books and educational materials",
    parentId: "5",
    icon: "book-open",
    color: "#8B5CF6",
    productCount: 12,
    active: false,
    sortOrder: 4,
    createdAt: "2025-10-01T10:15:00Z",
  },
  {
    id: "5",
    name: "Education",
    description: "Educational and learning resources",
    icon: "academic-cap",
    color: "#EC4899",
    productCount: 34,
    active: true,
    sortOrder: 5,
    createdAt: "2025-10-01T10:20:00Z",
  },
];
