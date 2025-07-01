const db = require("../db");
const productDao = {};

productDao.getProductByRating = async () => {
  // Conectamos con la base de datos y buscamos si existe el producto por su puntuacion
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "SELECT * FROM productos ORDER BY puntuacion DESC LIMIT 4",
      null,
      "select",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

productDao.getProductBySelling = async () => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "SELECT * FROM productos ORDER BY ventas DESC LIMIT 4",
      null,
      "select",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

productDao.getAllProducts = async () => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query("SELECT * FROM productos ", null, "select", conn);
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

module.exports = productDao;
