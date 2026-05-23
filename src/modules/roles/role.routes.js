// =============================================================
// ROUTES: role.routes.js
// Role management endpoints:
//   POST /  — Create a new role
//   GET  /  — Fetch all roles
// =============================================================

const express = require("express");
const router = express.Router();
const controller = require("./role.controller");

router.post("/", controller.createRole);
router.get("/", controller.getRoles);

module.exports = router;
