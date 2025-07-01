const express = require("express");
const {
  addUser,
  getUser,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
} = require("../controllers/userController");

const userRouter = express.Router();

userRouter.post("/", addUser);
userRouter.get("/", getUser);
userRouter.get("/:id", getUserById);
userRouter.patch("/:id", updateUser);
userRouter.delete("/:id", deleteUser);
userRouter.post("/login", loginUser);

module.exports = userRouter;
