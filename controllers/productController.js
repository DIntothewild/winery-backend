const productDao = require("../services/DAO/productDao");

const getProductbyRating = async (req, res) => {
  try {
    const topWines = await productDao.getProductByRating();
    console.log(topWines);
    if (topWines.length <= 0) return res.sendStatus(404);
    return res.status(200).json(topWines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductBySelling = async (req, res) => {
  try {
    const bestSelling = await productDao.getProductBySelling();
    if (bestSelling <= 0) return res.sendStatus(404);
    return res.status(200).json(bestSelling);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const allProducts = await productDao.getAllProducts();
    console.log(allProducts);
    if (allProducts.length <= 0) return res.sendStatus(404);
    return res.status(200).json(allProducts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProductbyRating, getProductBySelling, getAllProducts };
