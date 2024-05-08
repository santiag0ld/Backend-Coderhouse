import { Router } from "express";
import ProductsController from "../../controllers/products.controller.js";
import handleAuth from "../../middleware/auth.js";

const router = Router();
const pControl = new ProductsController();

router
  .get("/", pControl.getProducts)
  .get("/:pid", pControl.getProductById)
  .post("/", pControl.addProduct)
  .put("/:pid", pControl.updateProduct)
  .delete("/:pid", handleAuth(["USER_PREMIUM"]), pControl.deleteProduct)

export default router;
