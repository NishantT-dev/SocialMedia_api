import express from "express";
import { createUser,updateUser,getAllUsers,getUserData,deleteUser, loginUser } from "../controller/userController.js";
import { validateCreateUser } from "../middlewares/validateUser.js";
import { verifyToken } from "../middlewares/authiddleware.js";
const userRouter=express.Router();

userRouter.post("/",validateCreateUser, createUser); // Create user
userRouter.post("/login",loginUser)
userRouter.get("/:id", verifyToken,getUserData); // Get single user by ID
userRouter.get("/", getAllUsers); // Get all users
userRouter.patch("/:id",verifyToken, updateUser); // Update user by ID
userRouter.delete("/:id",verifyToken, deleteUser); // Delete user by ID
export default userRouter;
