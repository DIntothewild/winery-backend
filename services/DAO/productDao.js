// src/dao/productDao.js
const db = require("../db");
const productDao = {};

// Helper para selects sin params
async function runQuery(query) {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(query, null, "select", conn);
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
}

const selectFields = `
  SELECT
    id,
    nombre,
    precio,
    puntuacion,
    descripcion,
    categoria,
    ventas,
    CONCAT('/images/', imagen) AS image
  FROM productos
`;

productDao.getProductByRating = () =>
  runQuery(`${selectFields} ORDER BY puntuacion DESC LIMIT 4`);

productDao.getProductBySelling = () =>
  runQuery(`${selectFields} ORDER BY ventas DESC LIMIT 4`);

productDao.getAllProducts = () => runQuery(selectFields);

productDao.getProductById = async (id) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    const rows = await db.query(
      `SELECT
         id, nombre, precio, puntuacion, descripcion, categoria,
         tipo, denominacion, ventas,
         CONCAT('/images/', imagen) AS image
       FROM productos
       WHERE id = ?
       LIMIT 1`,
     [Number(id)],  
      "select",
      conn
    );
    return rows[0] || null;
  } catch (e) {
        console.error("[DAO getProductById] ERROR:", e);    
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

// --- RESEÑAS ---
productDao.addReview = async ({ productoId, rating, comentario }) => {
  const r = Number(rating);
  if (!Number.isInteger(r) || r < 1 || r > 5) {
    throw new Error("Rating inválido (1-5).");
  }
  const pid = Number(productoId);
  if (!Number.isInteger(pid) || pid <= 0) {
    throw new Error("productoId inválido.");
  }

  let conn = null;
  try {
    conn = await db.createConnection();

    // db.query con "insert" te devuelve el insertId (número)
    const insertId = await db.query(
      "INSERT INTO reviews (producto_id, rating, comentario) VALUES (?, ?, ?)",
      [pid, r, comentario ?? null],
      "insert",
      conn
    );

    // Útil mientras pruebas:
    console.log("Review insertId:", insertId);

    return { ok: true, id: insertId };
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

productDao.getReviewsByProduct = async (productoId) => {
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      `SELECT id, rating, comentario, created_at
       FROM reviews
       WHERE producto_id = ?
       ORDER BY created_at DESC`,
      [productoId],
      "select",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

module.exports = productDao;