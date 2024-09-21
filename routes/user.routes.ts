const express = require("express");
const userRoutes = express.Router();
const {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    deleteUser,
    changePassword,
    getAllUser
} = require("../controller/user.controller");
const {upload} = require("../helpers/imageUpload");
const {verifyToken} = require("../helpers/verifyToken")

userRoutes.post("/register", upload.single("profileImage"), registerUser);
userRoutes.post("/login", loginUser);
userRoutes.get("/", getProfile);
userRoutes.put("/", verifyToken, changePassword);
userRoutes.delete("/", verifyToken, deleteUser);
userRoutes.put("/update", verifyToken, upload.single("profileImage"), updateProfile);

module.exports = userRoutes;