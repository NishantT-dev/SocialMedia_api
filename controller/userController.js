import User from "../model/userModel.js";
import mongoose from "mongoose";
import logger from "../utils/logger.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
const createUser = async (req, res) => {
  try {
    const { userName, password, profilePicture, bio } = req.body;

    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this username",
      });
    }
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = crypto
      .pbkdf2Sync(password, salt, 100000, 64, "sha512")
      .toString("hex");

    const createdUser = await User.create({
      userName,
      password: hashedPassword,
      salt,
      profilePicture,
      bio,
      salt,
    });

    return res
      .status(201)
      .json({ message: "User Created successfully", createdUser });
  } catch (err) {
    logger.error(`Error creating user ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};
const loginUser = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName }).select("+password +salt");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const hashedPassword = crypto
      .pbkdf2Sync(password, user.salt, 100000, 64, "sha512")
      .toString("hex");
    if (hashedPassword !== user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, userName: user.userName },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    return res.status(200).json({
      message: "User login successful",
      token,
    });
  } catch (err) {
    logger.error(`Login Error ${err.message}`);
    res.status(500).json({ message: `User login error: ${err.message}` });
  }
};

const getUserData = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    const userData = await User.findById(userId);
    if (!userData) {
      return res
        .status(500)
        .json({ message: ` User with ID- ${userId} not found` });
    }
    return res
      .status(200)
      .json({ message: ` Data of ${userId} fetched successfully`, userData });
  } catch (err) {
    logger.error(` Error getting user data ${err.message}`);
    res.status(500).json({ message: err.message });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users || users.length === 0) {
      return res.status(500).json({ message: "No Users found" });
    }
    return res
      .status(200)
      .json({ message: "All users fetched successfully", users });
  } catch (err) {
    logger.error(` Error geting All users data ${err.message}`);

    res.status(500).json({ message: err.message });
  }
};
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // ✅ Validate ObjectId format first
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const updates = req.body;

    if (updates.password) {
      return res
        .status(400)
        .json({ message: "Password can't be changed here" });
    }

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not exists" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      message: "User info updated successfully",
      updatedUser,
    });
  } catch (err) {
    logger.error(` Error updating user ${err.message}`);
    return res
      .status(500)
      .json({ message: "Server error while updating user" });
  }
};
const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res
        .status(404)
        .json({ message: `User with ID ${userId} not found` });
    }
    userExists.isDeleted = true;
    await userExists.save();

    return res.status(200).json({
      message: `User with ID ${userId} marked as deleted successfully`,
    });
  } catch (err) {
    logger.error(` Error deleting user ${err.message}`);
    return res.status(500).json({
      error: "Server error while soft deleting user",
      details: err.message,
    });
  }
};

export {
  createUser,
  loginUser,
  getUserData,
  getAllUsers,
  updateUser,
  deleteUser,
};
