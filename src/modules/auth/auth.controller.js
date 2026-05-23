// =============================================================
// CONTROLLER: auth.controller.js
// Handles HTTP layer for authentication routes.
// Delegates all business logic to auth.service.js.
// =============================================================

const service = require("./auth.service");
const jwt = require("jsonwebtoken");
const { AppError, ERRORS } = require("../../config/errors");

// -------------------------------------------------------------
// POST /auth/login
// Accepts email and password, returns a pre_context token.
// -------------------------------------------------------------
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await service.login(email, password);

    res.json({
      success: true,
      message: "Login successful",
      pre_context_token: result.token,
      user: {
        id: result.user.id,
        full_name: result.user.full_name,
        email: result.user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

// -------------------------------------------------------------
// GET /auth/my-institutes-roles
// Reads the pre_context token and returns all institute-role
// options assigned to the user, for the context-selection screen.
// -------------------------------------------------------------
exports.getMyInstitutesRoles = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError(ERRORS.MISSING_TOKEN);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const data = await service.getMyInstitutesRoles(decoded.user_id);

    res.json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

// -------------------------------------------------------------
// POST /auth/select-context
// Validates the pre_context token, confirms the chosen mapping,
// and returns a full access token with the selected context embedded.
// -------------------------------------------------------------
exports.selectContext = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError(ERRORS.MISSING_TOKEN);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Only pre_context tokens are accepted at this stage
    if (decoded.token_type !== "pre_context") {
      throw new AppError(ERRORS.TOKEN_TYPE_MISMATCH);
    }

    const { tenant_id, institute_id, role_id } = req.body;

    const accessToken = await service.selectContext(
      decoded.user_id,
      tenant_id,
      institute_id,
      role_id,
    );

    res.json({
      success: true,
      access_token: accessToken,
      selected_context: {
        tenant_id,
        institute_id,
        role_id,
      },
    });
  } catch (err) {
    next(err);
  }
};

// -------------------------------------------------------------
// GET /auth/me  (protected — requires authMiddleware)
// Returns the decoded token payload attached by authMiddleware.
// -------------------------------------------------------------
exports.me = (req, res) => {
  res.json({
    success: true,
    data: req.user,
  });
};
