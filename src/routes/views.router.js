import { Router } from "express";
import  handleAuth  from "../middleware/auth.js";
import ViewsController from "../controllers/views.controller.js";

const router = Router();
const vControl = new ViewsController();

router
  .get("/", handleAuth(["PUBLIC"]), (req, res) => vControl.home(req, res))
  .get("/login", handleAuth(["PUBLIC"]), (req, res) => vControl.login(req, res))
  .get("/register", handleAuth(["PUBLIC"]), (req, res) => vControl.register(req, res))
  .get("/products", handleAuth(["PUBLIC"]), (req, res) => vControl.products(req, res))
  .get("/products/:pid", handleAuth(["PUBLIC"]), (req, res) => vControl.productById(req, res))
  .get("/cart", handleAuth(["USER", "USER_PREMIUM"]), (req, res) => vControl.cart(req, res))
  .get("/realTimeProducts", handleAuth(["USER_PREMIUM"]), (req, res) => vControl.realTimeProducts(req, res))
  .get("/chat", handleAuth(["USER", "USER_PREMIUM"]), (req, res) => vControl.chat(req, res))
  .get("/user", handleAuth(["USER", "USER_PREMIUM"]), (req, res) => vControl.user(req, res));
  

export default router;
