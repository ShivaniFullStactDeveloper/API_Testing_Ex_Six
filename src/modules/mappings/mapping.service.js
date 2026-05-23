// =============================================================
// SERVICE: mapping.service.js
// Handles user-institute-role mapping business logic.
// =============================================================

const { pool } = require("../../config/db");
const { AppError, ERRORS } = require("../../config/errors");
const { MAPPING_QUERIES } = require("../../config/queries");


// -------------------------------------------------------------
// CREATE MAPPING
// Assigns a user to an institute with a specific role.
// Throws if the mapping already exists to prevent duplicates.
// -------------------------------------------------------------
exports.createMapping = async (data) => {
  const { tenant_id, user_id, institute_id, role_id, is_primary } = data;

  if (
    !tenant_id ||
    !user_id ||
    !institute_id ||
    !role_id
  ) {
    throw new AppError(ERRORS.VALIDATION_FAILED);
  }

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (
    !uuidRegex.test(tenant_id) ||
    !uuidRegex.test(user_id) ||
    !uuidRegex.test(institute_id) ||
    !uuidRegex.test(role_id)
  ) {
    throw new AppError(ERRORS.VALIDATION_FAILED);
  }

  if (
    is_primary !== undefined &&
    typeof is_primary !== "boolean"
  ) {
    throw new AppError(ERRORS.VALIDATION_FAILED);
  }

  // Check for an existing mapping before inserting
  const check = await pool.query(MAPPING_QUERIES.CHECK_DUPLICATE_MAPPING, [
    user_id,
    institute_id,
    role_id,
  ]);

  if (check.rows.length > 0) {
    throw new AppError(ERRORS.MAPPING_ALREADY_EXISTS);
  }

  try {
    const result = await pool.query(MAPPING_QUERIES.CREATE_MAPPING, [
      tenant_id,
      user_id,
      institute_id,
      role_id,
      is_primary ?? false,
    ]);

    return result.rows[0];
  } catch (err) {
    if (err.code === "23503") {
      throw new AppError(ERRORS.VALIDATION_FAILED);
    }

    throw new AppError(ERRORS.MAPPING_CREATE_FAILED);
  }
};


// -------------------------------------------------------------
// GET ALL MAPPINGS
// Returns all mappings joined with user, institute, and role names.
// -------------------------------------------------------------
exports.getMappings = async () => {
  const result = await pool.query(MAPPING_QUERIES.GET_ALL_MAPPINGS);
  return result.rows;
};
