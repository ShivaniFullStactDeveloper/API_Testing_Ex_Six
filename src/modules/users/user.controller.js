// =============================================================
// CONTROLLER: user.controller.js
// Handles HTTP layer for user routes.
// Delegates all business logic to user.service.js.
// =============================================================

const userService = require("./user.service");


// -------------------------------------------------------------
// POST /users
// Creates a new user from the request body.
// -------------------------------------------------------------
exports.createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// =====================================================
// GET USERS
// =====================================================
exports.getUsers = async (
    req,
    res,
    next
) => {

    try {
        res.status(200).json({
            success: true,
            message:
                'Users fetched successfully'
        });
    } catch (err) {
        next(err);
    }

};