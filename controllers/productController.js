const productDao = require("../services/DAO/productDao");

// TOP RATED
const getProductByRating = async (req, res) => {
  try {
    const topWines = await productDao.getProductByRating();
    if (!topWines || topWines.length === 0) return res.sendStatus(404);
    return res.status(200).json(topWines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// TOP SELLING
const getProductBySelling = async (req, res) => {
  try {
    const bestSelling = await productDao.getProductBySelling();
    if (!bestSelling || bestSelling.length === 0) return res.sendStatus(404);
    return res.status(200).json(bestSelling);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ALL
const getAllProducts = async (req, res) => {
  try {
    const allProducts = await productDao.getAllProducts();
    if (!allProducts || allProducts.length === 0) return res.sendStatus(404);
    return res.status(200).json(allProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// BY ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productDao.getProductById(id);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });
    return res.status(200).json(product);
  } catch (error) {
     console.error("[getProductById] ERROR:", error); 
    res.status(500).json({ error: error.message });
  }
};

// REVIEWS - CREATE
const createReview = async (req, res) => {
  try {
    const { id } = req.params;               // id del producto
    const { rating, comentario } = req.body; // viene del frontend

    if (!rating) return res.status(400).json({ error: "rating requerido" });
    const ratingNum = Number(rating);
    if (Number.isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: "rating debe estar entre 1 y 5" });
    }

    await productDao.addReview({
      productoId: Number(id),
      rating: ratingNum,
      comentario: comentario || ""
    });

    return res.status(201).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// REVIEWS - LIST BY PRODUCT
const getReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const rows = await productDao.getReviewsByProduct(Number(id));
    return res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = {
  getProductByRating,
  getProductBySelling,
  getAllProducts,
  getProductById,
  createReview,
  getReviews
};
