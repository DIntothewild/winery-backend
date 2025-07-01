const express = require("express");
const dotenv = require("dotenv");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRouter = require("./routes/userRouter");
const { pool } = require("./olddb"); // Importa la conexión a la base de datos
const productRouter = require("./routes/productRouter");

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use("/users", userRouter);
app.use("/products", productRouter);
const main = async () => {
  try {
    // Test the database connection
    await pool.getConnection();
    console.log("Database connected!");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

main();
