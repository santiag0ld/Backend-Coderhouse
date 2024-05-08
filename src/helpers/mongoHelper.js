import { ProductMongo } from "../daos/mongo/products.daoMongo";

const productService = new ProductMongo();

export const convertSort = (option, element) => {
  const sortOptions = {
    "1": 1,
    "-1": -1,
    asc: "asc",
    desc: "desc",
  };
  if(!option) return {}
  const objectReturn = {}
  objectReturn[element] = sortOptions[option];
  return objectReturn;
}

export const convertAvailability = (availability) => {
  if (availability == "true") return { stock: { $gt: 0 } }
}

export const checkCategory = async (category) => {
  try {
    console.log("Fetching categories...");
    const categories = await productService.getCategorys();
    console.log("Categories:", categories);
    return categories.includes(category);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return false;
  }
}
