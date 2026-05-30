// =============================================================
// CONTROLLER: tenant.controller.js
// Handles HTTP layer for tenant routes.
// Delegates all business logic to tenant.service.js.
// =============================================================

const service = require("./tenant.service");


// -------------------------------------------------------------
// POST /tenants
// Creates a new tenant from the request body.
// -------------------------------------------------------------
exports.createTenant = async (req, res, next) => {
  try {
    const data = await service.createTenant(req.body);

    res.status(201).json({
      success: true,
      message: "Tenant created successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
};


// -------------------------------------------------------------
// GET /tenants
// Returns all tenants.
// -------------------------------------------------------------
exports.getTenants = async (req, res, next) => {
  try {
    const data = await service.getTenants();

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};
