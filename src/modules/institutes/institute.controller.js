// =============================================================
// CONTROLLER: institute.controller.js
// Handles HTTP layer for institute routes.
// Delegates all business logic to institute.service.js.
// =============================================================

const service = require("./institute.service");


// -------------------------------------------------------------
// POST /institutes
// Creates a new institute from the request body.
// -------------------------------------------------------------
exports.createInstitute = async (req, res, next) => {
  try {
    const data = await service.createInstitute(req.body);

    res.status(201).json({
      success: true,
      message: "Institute created successfully",
      data,
    });
  } catch (err) {
    next(err);
  }
};


// -------------------------------------------------------------
// GET /institutes
// Returns all institutes.
// -------------------------------------------------------------
exports.getInstitutes = async (req, res, next) => {
  try {
    const data = await service.getInstitutes();

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};
