const db = require("../db");
const md5 = require("md5");
const moment = require("moment");
const userDao = {};

userDao.getUserByEmail = async (email) => {
  // Conectamos con la base de datos y buscamos si existe el usuario por el email.
  let conn = null;
  try {
    conn = await db.createConnection();
    return await db.query(
      "SELECT * FROM Usuarios WHERE correo = ?",
      email,
      "select",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};

userDao.addUser = async (userData) => {
  // Conectamos con la base de datos y añadimos el usuario.
  let conn = null;
  try {
    conn = await db.createConnection();
    // Creamos un objeto con los datos del usuario a guardar en la base de datos.
    // Encriptamos la password con md5 y usamos la librería momentjs para registrar la fecha actual
    let userObj = {
      nombre: userData.nombre,
      apellidos: userData.apellidos,
      correo: userData.correo,
      password: md5(userData.password),
      telefono: userData.telefono, 
      fechaDeRegistro: moment().format("YYYY-MM-DD HH:mm:ss"),
    };
    return await db.query(
      "INSERT INTO Usuarios SET ?",
      userObj,
      "insert",
      conn
    );
  } catch (e) {
    throw new Error(e);
  } finally {
    conn && (await conn.end());
  }
};
module.exports = userDao;
