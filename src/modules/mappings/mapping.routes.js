// =============================================================
// ROUTES: mapping.routes.js
// User-institute-role mapping endpoints:
//   POST /  — Create a new mapping
//   GET  /  — Fetch all mappings
// =============================================================

const express = require("express");
const router = express.Router();
const controller = require("./mapping.controller");

router.post("/", controller.createMapping);
router.get("/", controller.getMappings);

module.exports = router;
