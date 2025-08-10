const express = require("express");
const {
  getProductByRating,
  getProductBySelling,
  getAllProducts,
  getProductById,
  createReview,
  getReviews,
} = require("../controllers/productController");

const productRouter = express.Router();

// OJO: rutas específicas antes de "/:id"
productRouter.get("/top-rated", getProductByRating);
productRouter.get("/top-selling", getProductBySelling);

productRouter.get("/", getAllProducts);
productRouter.get("/:id", getProductById);

// Reseñas
productRouter.post("/:id/reviews", createReview);
productRouter.get("/:id/reviews", getReviews);

module.exports = productRouter;