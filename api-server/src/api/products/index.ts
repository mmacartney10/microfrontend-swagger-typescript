import { Request, Response } from "express";
import { productsData, Product } from "../../data/products";

const getProducts = (request: Request, response: Response): void => {
  console.log("getProducts");
  response.status(200).json(productsData);
};

const getProduct = (request: Request, response: Response): void => {
  const { id } = request.params;
  console.log("getProduct", id);

  const product = productsData.find((p) => p.id === id);
  if (!product) {
    response.status(404).json({ error: "Product not found" });
    return;
  }

  response.status(200).json(product);
};

const postProduct = (request: Request, response: Response): void => {
  console.log("postProduct", request.body);

  try {
    const newProduct: Product = {
      id: String(productsData.length + 1),
      ...request.body,
      createdAt: new Date().toISOString(),
    } as Product;

    productsData.push(newProduct);
    response.status(201).json(newProduct);
  } catch (error) {
    response.status(400).json({ error: "Invalid product data" });
  }
};

export { getProducts, getProduct, postProduct };
