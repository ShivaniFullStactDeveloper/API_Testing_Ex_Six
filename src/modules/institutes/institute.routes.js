// =============================================================
// ROUTES: institute.routes.js
// Institute management endpoints:
//   POST /  — Create a new institute
//   GET  /  — Fetch all institutes
// =============================================================

const express = require("express");
const router = express.Router();
const controller = require("./institute.controller");
const authMiddleware = require("../../middleware/authMiddleware");

router.post("/", authMiddleware, controller.createInstitute);
router.get("/", authMiddleware, controller.getInstitutes);

module.exports = router;
