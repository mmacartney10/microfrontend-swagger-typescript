import React, { useState } from "react";
import {
  useProductsList,
  useProductsDetail,
  useCreateProducts,
  ProductInput,
} from "@swagger-ts/api-client";
import { productsService } from "../services/api";

const ProductList: React.FC = () => {
  const { data: products, isLoading, error } = useProductsList(productsService);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const { data: selectedProduct } = useProductsDetail(
    productsService,
    selectedProductId,
  );
  const createProduct = useCreateProducts(productsService);

  const handleCreateProduct = () => {
    const newProduct: ProductInput = {
      name: `Product ${Date.now()}`,
      description: "Auto-generated product",
      price: Math.floor(Math.random() * 100) + 10,
      category: "Electronics",
      inStock: true,
      tags: ["demo", "auto-generated"],
    };
    createProduct.mutate(newProduct);
  };

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products: {String(error)}</div>;

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>🛍️ Products</h3>
      <button
        onClick={handleCreateProduct}
        disabled={createProduct.isPending}
        style={{ marginBottom: "10px", padding: "5px 10px" }}
      >
        {createProduct.isPending ? "Creating..." : "Add Product"}
      </button>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <h4>Product List</h4>
          <div style={{ overflowY: "auto" }}>
            {products?.data?.map((product) => (
              <div
                key={product.id}
                style={{
                  padding: "8px",
                  border: "1px solid #ccc",
                  margin: "5px 0",
                  cursor: "pointer",
                  backgroundColor:
                    selectedProductId === product.id ? "#e6f3ff" : "white",
                }}
                onClick={() => setSelectedProductId(product.id || "")}
              >
                <strong>{product.name}</strong> - ${product.price}
                <span
                  style={{
                    color: product.inStock ? "green" : "red",
                    marginLeft: "10px",
                  }}
                >
                  {product.inStock ? "✓" : "✗"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h4>Product Details</h4>
          {selectedProduct?.data ? (
            <div
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h5>{selectedProduct.data.name}</h5>
              <p>{selectedProduct.data.description}</p>
              <p>
                <strong>Price:</strong> ${selectedProduct.data.price}
              </p>
              <p>
                <strong>Category:</strong> {selectedProduct.data.category}
              </p>
              <p>
                <strong>Tags:</strong> {selectedProduct.data.tags?.join(", ")}
              </p>
            </div>
          ) : (
            <p>Select a product to see details</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
