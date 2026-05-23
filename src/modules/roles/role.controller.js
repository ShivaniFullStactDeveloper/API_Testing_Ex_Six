// =============================================================
// CONTROLLER: role.controller.js
// Handles HTTP layer for role routes.
// Delegates all business logic to role.service.js.
// =============================================================

const service = require("./role.service");


// -------------------------------------------------------------
// POST /roles
// Creates a new role from the request body.
// -------------------------------------------------------------
exports.createRole = async (req, res, next) => {
  try {
    const data = await service.createRole(req.body);

    res.status(201).json({
      success: true,
      message: "Role created successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
};


// -------------------------------------------------------------
// GET /roles
// Returns all roles.
// -------------------------------------------------------------
exports.getRoles = async (req, res, next) => {
  try {
    const data = await service.getRoles();

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};
