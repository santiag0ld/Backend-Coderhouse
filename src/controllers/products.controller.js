import { productsService, userService } from "../repository/service.js";
import CustomError from "../utils/CustomError.js";
import { logger } from "../utils/logger.js";
import sendEmail from "../middleware/sendMail.js";

class ProductsController {
  constructor() {
    this.productsService = productsService;
    this.userService = userService;
  }

  getProducts = async (req, res, next) => {
    try {
      const { limit, pageNumber, sort, query } = req.query;
  
      const parsedLimit = parseInt(limit) || 10;
      const parsedPageNumber = parseInt(pageNumber) || 1;
      const sortOrder = sort === "asc" ? 1 : -1;
  
      const productsData = await this.productsService.getProducts({
        limit: parsedLimit,
        pageNumber: parsedPageNumber,
        sort: sortOrder,
        query: query || "",
      });
      res.json({
        status: "success",
        payload: productsData,
      });
    } catch (error) {
      console.error(error);
      next(new CustomError({ message: "Server error", code: 500, err: error }));
    }
  };
  
  

  getProductById = async (req, res, next) => {
    try {
      const pid = req.params.pid;
      if (!pid) {
        next(new CustomError({ message: "Not found a product", code: 404 }));
      }
      const filteredProduct = await this.productsService.getProductById(pid);
      res.json({
        status: "succes",
        payload: filteredProduct,
      });
    } catch (error) {
      next(new CustomError({ message: "Server error", code: 500 }));
    }
  };

  addProduct = async (req, res, next) => {
    try {
      const {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
      } = req.body;

      const user = req.session.user;
      if (user.role !== "premium" && user.role !== "admin") {
        return res
          .status(403)
          .json({
            status: "error",
            message: "Only user premium or admin can create product",
          });
      }
      console.log("pase el verificador, soy admin");
      if (!title || !price || !code || !stock) {
        next(new CustomError({ message: "Product creation error", code: 400 }));
      }

      const owner = user.user;
      const newProduct = await this.productsService.addProduct({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
        owner,
      });
      res.json({
        status: "success",
        payload: newProduct,
        message: "Product added successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req, res, next) => {
    try {
      const pid = req.params.pid;
      const {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
      } = req.body;
      if (!title || !price || !code || !stock) {
        next(new CustomError({ message: "Por favor, complete todos los campos" }));
      }
      await this.productsService.updateProduct(
        pid,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category
      );
      res.json({
        status: "success",
        message: "Product updated successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req, res, next) => {
    try {
      const pid = req.params.pid;
      const user = req.session.user;

      const product = await this.productsService.getProductById(pid);
      if (!product) {
        return res
          .status(404)
          .json({ status: "error", message: "Product not found" });
      }

      if (user.role === "admin" || product.owner.equals(user._id)) {
        const deletedProduct = await this.productsService.deleteProduct(
          pid
        );
        if (deletedProduct) {
          if (product.owner && user.role === "premium") {
            const ownerEmail = product.owner.email;
            const subject = "Product Deleted";
            const html = `
                      <p>Dear ${product.owner.first_name},</p>
                      <p>We would like to inform you that your product "${deletedProduct.title}" has been deleted from our platform.</p>
                      <p>If you have any questions, please do not hesitate to contact us.</p>
                      <p>Thank you for using our platform.</p>
                  `;

            await sendEmail(ownerEmail, subject, html);
          }

          return res.json({
            status: "success",
            message: "Product deleted successfully",
          });
        }
        return res
          .status(404)
          .json({ status: "error", message: "Product not found" });
      } else {
        return res
          .status(403)
          .json({
            status: "error",
            message: "Unauthorized to delete this product",
          });
      }
    } catch (error) {
      next(error);
    }
  };
}

export default ProductsController;