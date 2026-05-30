// =============================================================
// ROUTES: user.routes.js
// User management endpoints:
//   POST /  — Create a new user
// =============================================================

const express = require("express");
const router = express.Router();
const userController = require("./user.controller");
const authMiddleware = require("../../middleware/authMiddleware");

router.post("/", userController.createUser);
router.get("/", authMiddleware,userController.getUsers);

module.exports = router;
