const express = require("express");
const {
  getProductbyRating,
  getProductBySelling,
  getAllProducts,
} = require("../controllers/productController");

const productRouter = express.Router();

productRouter.get("/top-rated", getProductbyRating);
productRouter.get("/top-selling", getProductBySelling);
productRouter.get("/", getAllProducts);
module.exports = productRouter;
