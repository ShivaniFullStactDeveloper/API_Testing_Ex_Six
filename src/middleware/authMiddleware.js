// =============================================================
// MIDDLEWARE: authMiddleware.js
// Verifies the JWT access token on protected routes.
// Attaches decoded user context to req.user for downstream use.
// =============================================================

const jwt = require("jsonwebtoken");
const { AppError, ERRORS } = require("../config/errors");

const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

module.exports = (req, res, next) => {
  try {
    // Extract Bearer token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new AppError(ERRORS.MISSING_TOKEN);
    }

    // Verify token signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Only "access" tokens are allowed on protected routes.
    // "pre_context" tokens must first go through /select-context.
    if (decoded.token_type !== "access") {
      throw new AppError(ERRORS.TOKEN_TYPE_MISMATCH);
    }

    if (
      !uuidRegex.test(decoded.user_id || "") ||
      !uuidRegex.test(decoded.tenant_id || "") ||
      !uuidRegex.test(decoded.institute_id || "") ||
      !uuidRegex.test(decoded.role_id || "")
    ) {
      throw new AppError(ERRORS.TOKEN_TYPE_MISMATCH);
    }

    // Attach decoded payload to request for use in controllers
    req.user = decoded;

    next();
  } catch (err) {
    // Delegate all errors (AppError, JWT errors) to the global error handler
    next(err);
  }
};
