// =============================================================
// ROUTES: institute.routes.js
// Institute management endpoints:
//   POST /  — Create a new institute
//   GET  /  — Fetch all institutes
// =============================================================

const express = require("express");
const router = express.Router();
const controller = require("./institute.controller");

router.post("/", controller.createInstitute);
router.get("/", controller.getInstitutes);

module.exports = router;
