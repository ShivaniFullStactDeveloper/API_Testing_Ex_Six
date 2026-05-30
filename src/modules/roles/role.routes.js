// =============================================================
// ROUTES: role.routes.js
// Role management endpoints:
//   POST /  — Create a new role
//   GET  /  — Fetch all roles
// =============================================================

const express = require("express");
const router = express.Router();
const controller = require("./role.controller");
const authMiddleware = require("../../middleware/authMiddleware");

router.post("/", authMiddleware, controller.createRole);
router.get("/", authMiddleware, controller.getRoles);

module.exports = router;
