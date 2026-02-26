import React from "react";
import { useProducts } from "@swagger-ts/api-client";
import { productsService } from "../services/api";

const ProductViewer: React.FC = () => {
  const { data: products, isLoading, error } = useProducts(productsService);

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products: {String(error)}</div>;

  const totalValue =
    products?.data?.reduce((sum, product) => sum + (product.price || 0), 0) ||
    0;
  const inStockCount = products?.data?.filter((p) => p.inStock).length || 0;

  return (
    <div style={{ marginBottom: "20px" }}>
      <h3>🛍️ Product Catalog (Read-Only)</h3>

      <div style={{ display: "flex", gap: "20px", marginBottom: "15px" }}>
        <div
          style={{
            padding: "10px",
            backgroundColor: "#e3f2fd",
            borderRadius: "4px",
          }}
        >
          <strong>Total Products:</strong> {products?.data?.length || 0}
        </div>
        <div
          style={{
            padding: "10px",
            backgroundColor: "#e8f5e8",
            borderRadius: "4px",
          }}
        >
          <strong>In Stock:</strong> {inStockCount}
        </div>
        <div
          style={{
            padding: "10px",
            backgroundColor: "#fff3e0",
            borderRadius: "4px",
          }}
        >
          <strong>Total Value:</strong> ${totalValue.toFixed(2)}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "10px",
          maxHeight: "200px",
          overflowY: "auto",
        }}
      >
        {products?.data?.map((product) => (
          <div
            key={product.id}
            style={{
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              backgroundColor: product.inStock ? "white" : "#f5f5f5",
            }}
          >
            <h5 style={{ margin: "0 0 5px 0" }}>{product.name}</h5>
            <p style={{ margin: "0", fontSize: "14px", color: "#666" }}>
              {product.description}
            </p>
            <div
              style={{
                marginTop: "5px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <strong>${product.price}</strong>
              <span style={{ color: product.inStock ? "green" : "red" }}>
                {product.inStock ? "✓ In Stock" : "✗ Out"}
              </span>
            </div>
            {product.tags && product.tags.length > 0 && (
              <div style={{ marginTop: "5px", fontSize: "11px" }}>
                {product.tags.join(", ")}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductViewer;
