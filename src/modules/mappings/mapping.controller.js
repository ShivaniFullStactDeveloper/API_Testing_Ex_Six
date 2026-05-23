// =============================================================
// CONTROLLER: mapping.controller.js
// Handles HTTP layer for mapping routes.
// Delegates all business logic to mapping.service.js.
// =============================================================

const service = require("./mapping.service");


// -------------------------------------------------------------
// POST /mappings
// Creates a new user-institute-role mapping from the request body.
// -------------------------------------------------------------
exports.createMapping = async (req, res, next) => {
  try {
    const data = await service.createMapping(req.body);

    res.status(201).json({
      success: true,
      message: "Mapping created successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
};


// -------------------------------------------------------------
// GET /mappings
// Returns all mappings with joined user, institute, and role info.
// -------------------------------------------------------------
exports.getMappings = async (req, res, next) => {
  try {
    const data = await service.getMappings();

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};
