const md5 = require("md5");
const dao = require("../services/DAO/userDao");
const { SignJWT } = require("jose");

const addUser = async (req, res) => {
    const { nombre, apellidos, correo, password, telefono } = req.body;

    if (!nombre || !correo || !password) {
        return res.status(400).send("Faltan datos obligatorios");
    }

    try {
        // Encriptamos la contraseña
        const encryptedPassword = md5(password);

        const nuevoUsuario = {
            nombre,
            apellidos,
            correo,
            password: encryptedPassword,
            telefono,
            fechaDeRegistro: new Date()
        };

        // Llama a tu DAO para guardar el usuario
        const resultado = await dao.addUser(nuevoUsuario);

        res.status(201).send("Usuario registrado correctamente");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al registrar usuario");
    }
};

const getUser = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ error: "User not found" });
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellidos, correo, telefono } = req.body;
    const [result] = await pool.query(
      "UPDATE usuarios SET nombre = ?, apellidos = ?, correo = ?, telefono = ? WHERE id = ?",
      [nombre, apellidos, correo, telefono, id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "User not found" });
    res.status(200).json({ id, nombre, apellidos, correo, telefono });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query("DELETE FROM usuarios WHERE id = ?", [
      id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404) /* .json({ error: "User not found" }) */;
    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password)
    return res
      .status(400)
      .send({ error: "Email y contraseña son obligatorios" });
  try {
    let user = await dao.getUserByEmail(email);
    console.log(user);
    if (user.length <= 0)
      return res.sendStatus(
        404
      ) /* .send({ error: "Usuario no encontrado" }) */;
    const usuarioPassword = md5(password);
    [user] = user;
    console.log(user);
    if (user.password !== usuarioPassword)
      return res.status(401).send("Contraseña incorrecta");
    // Si es correcta generamos el token y lo devolvemos al cliente
    // Construimos el JWT con el id, email y rol del usuario
    const jwtConstructor = new SignJWT({
      id: user.id,
      correo: email,
      role: user.userRole,
    });
    // Codificamos el la clave secreta definida en la variable de entorno por requisito de la librería jose
    // y poder pasarla en el formato correcto (uint8Array) en el método .sign
    const encoder = new TextEncoder();
    // Generamos el JWT. Lo hacemos asíncrono, ya que nos devuelve una promesa.
    // Le indicamos la cabecera, la creación, la expiración y la firma (clave secreta).
    const jwt = await jwtConstructor
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(encoder.encode(process.env.JWT_SECRET));
    //Si todo es correcto enviamos la respuesta. 200 OK
   return res.send({
  jwt,
  nombre: user.nombre, // <-- añadimos el nombre
});
  } catch (e) {
    console.log(e.message);
  }
};

module.exports = {
  addUser,
  getUser,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
};
