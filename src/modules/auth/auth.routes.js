// =============================================================
// ROUTES: auth.routes.js
// Auth-related endpoints:
//   POST /login              — Login with email/password
//   GET  /my-institutes-roles — Fetch institute/role options (pre_context token)
//   POST /select-context     — Choose a context, receive an access token
//   GET  /me                 — Return current user info (access token required)
// =============================================================

const express = require("express");
const router = express.Router();
const controller = require("./auth.controller");
const authMiddleware = require("../../middleware/authMiddleware");

router.post("/login", controller.login);
router.get("/my-institutes-roles", controller.getMyInstitutesRoles);
router.post("/select-context", controller.selectContext);

// Protected route — requires a valid access token
router.get("/me", authMiddleware, controller.me);

module.exports = router;
