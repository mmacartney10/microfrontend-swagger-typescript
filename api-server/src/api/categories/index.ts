import { Request, Response } from "express";
import { categoriesData, Category } from "../../data/categories";

const getCategories = (request: Request, response: Response): void => {
  console.log("getCategories");
  response.status(200).json(categoriesData);
};

const postCategory = (request: Request, response: Response): void => {
  console.log("postCategory", request.body);

  try {
    const newCategory: Category = {
      id: String(categoriesData.length + 1),
      ...request.body,
      createdAt: new Date().toISOString(),
      active: true,
      productCount: 0,
      sortOrder: categoriesData.length + 1,
    } as Category;

    categoriesData.push(newCategory);
    response.status(201).json(newCategory);
  } catch (error) {
    response.status(400).json({ error: "Invalid category data" });
  }
};

const deleteCategory = (request: Request, response: Response): void => {
  const { id } = request.params;
  console.log("deleteCategory", id);

  const categoryIndex = categoriesData.findIndex((cat) => cat.id === id);
  if (categoryIndex === -1) {
    response.status(404).json({ error: "Category not found" });
    return;
  }

  const deletedCategory = categoriesData.splice(categoryIndex, 1)[0];
  response.status(200).json(deletedCategory);
};

export { getCategories, postCategory, deleteCategory };
