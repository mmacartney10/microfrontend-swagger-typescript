import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/api';
import { Product, ProductInput } from '@swagger-ts/api-client';

const ProductsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  // Fetch all products
  const { data: products, isLoading: loadingProducts, error: productsError } = useQuery({
    queryKey: ['products'],
    queryFn: () => apiClient.productsService.productsList(),
  });

  // Fetch specific product details
  const { data: selectedProduct, isLoading: loadingProduct } = useQuery({
    queryKey: ['product', selectedProductId],
    queryFn: () => apiClient.productsService.productsDetail({ id: selectedProductId! }),
    enabled: !!selectedProductId,
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: (newProduct: ProductInput) => apiClient.productsService.productsCreate(newProduct),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  const handleCreateProduct = () => {
    const newProduct: ProductInput = {
      name: 'Microfrontend Widget',
      description: 'A widget created from the microfrontend',
      price: 49.99,
      category: 'Software',
      inStock: true,
      tags: ['microfrontend', 'widget', 'software'],
    };
    createProductMutation.mutate(newProduct);
  };

  if (loadingProducts) return <div>Loading products...</div>;
  if (productsError) return <div>Error loading products: {productsError.message}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>🛍️ Products Catalog</h2>
      
      <button 
        onClick={handleCreateProduct}
        disabled={createProductMutation.isPending}
        style={{
          backgroundColor: '#10B981',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          marginBottom: '20px',
        }}
      >
        {createProductMutation.isPending ? 'Creating...' : 'Add New Product'}
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Products List */}
        <div>
          <h3>All Products</h3>
          <div style={{ display: 'grid', gap: '10px' }}>
            {products?.data?.map((product) => (
              <div
                key={product.id}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px',
                  cursor: 'pointer',
                  backgroundColor: selectedProductId === product.id ? '#f0f9ff' : 'white',
                }}
                onClick={() => setSelectedProductId(product.id!)}
              >
                <h4 style={{ margin: '0 0 5px 0' }}>{product.name}</h4>
                <p style={{ margin: '0 0 10px 0', color: '#666' }}>{product.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.2em', fontWeight: 'bold', color: '#3B82F6' }}>
                    ${product.price}
                  </span>
                  <span style={{
                    backgroundColor: product.inStock ? '#10B981' : '#EF4444',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.9em'
                  }}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div style={{ marginTop: '10px' }}>
                  {product.tags?.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: '#F3F4F6',
                        color: '#374151',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        fontSize: '0.8em',
                        marginRight: '5px'
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h3>Product Details</h3>
          {selectedProductId ? (
            loadingProduct ? (
              <div>Loading product details...</div>
            ) : selectedProduct?.data ? (
              <div style={{
                border: '2px solid #3B82F6',
                borderRadius: '8px',
                padding: '20px',
                backgroundColor: '#f8fafc'
              }}>
                <h3>{selectedProduct.data.name}</h3>
                <p style={{ color: '#666', marginBottom: '15px' }}>{selectedProduct.data.description}</p>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Price: </strong>
                  <span style={{ fontSize: '1.5em', color: '#3B82F6' }}>${selectedProduct.data.price}</span>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Category: </strong>{selectedProduct.data.category}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Status: </strong>
                  <span style={{
                    backgroundColor: selectedProduct.data.inStock ? '#10B981' : '#EF4444',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px'
                  }}>
                    {selectedProduct.data.inStock ? 'Available' : 'Out of Stock'}
                  </span>
                </div>
                {selectedProduct.data.imageUrl && (
                  <div style={{ marginBottom: '10px' }}>
                    <strong>Image: </strong>{selectedProduct.data.imageUrl}
                  </div>
                )}
                {selectedProduct.data.createdAt && (
                  <div style={{ fontSize: '0.9em', color: '#666' }}>
                    Created: {new Date(selectedProduct.data.createdAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            ) : null
          ) : (
            <div style={{ 
              border: '1px dashed #ddd', 
              borderRadius: '8px', 
              padding: '40px', 
              textAlign: 'center',
              color: '#666'
            }}>
              Select a product to view details
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;