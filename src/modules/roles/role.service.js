
// =============================================================
// SERVICE: role.service.js
// Handles role creation and retrieval business logic.
// =============================================================

const { pool } = require("../../config/db");

const { AppError } =
  require("../../config/errors");

const { ROLE_QUERIES } =
  require("../../config/queries");


// -------------------------------------------------------------
// CREATE ROLE
// -------------------------------------------------------------
exports.createRole = async (data) => {

  const {
    name,
    code,
    icon,
    description
  } = data;


  // =====================================================
  // REQUIRED FIELD VALIDATION
  // =====================================================
  if (
    !name ||
    !code
  ) {

    throw new AppError({

      statusCode: 400,

      code: 'ROLE_003',

      message:
        'name and code are required.'

    });

  }


  // =====================================================
  // ROLE NAME VALIDATION
  // =====================================================
  const roleNameRegex =
    /^[A-Za-z\s]+$/;

  if (!roleNameRegex.test(name)) {

    throw new AppError({

      statusCode: 400,

      code: 'ROLE_004',

      message:
        'Invalid role name.'

    });

  }


  // =====================================================
  // ROLE CODE VALIDATION
  // =====================================================
  const roleCodeRegex =
    /^[A-Z0-9_]+$/;

  if (!roleCodeRegex.test(code)) {

    throw new AppError({

      statusCode: 400,

      code: 'ROLE_005',

      message:
        'Invalid role code.'

    });

  }


  // =====================================================
  // ICON VALIDATION
  // =====================================================
  if (icon) {

    const iconRegex =
      /^[A-Za-z0-9_-]+$/;

    if (!iconRegex.test(icon)) {

      throw new AppError({

        statusCode: 400,

        code: 'ROLE_006',

        message:
          'Invalid role icon.'

      });

    }

  }


  try {

    const result = await pool.query(

      ROLE_QUERIES.CREATE_ROLE,

      [
        name,
        code,
        icon,
        description,
      ]

    );

    return result.rows[0];

  } catch (err) {

    console.error(
      'DB ERROR:',
      err.message
    );


    // =================================================
    // DUPLICATE ERRORS
    // =================================================
    if (err.code === '23505') {

      // DUPLICATE CODE
      if (
        err.constraint ===
        'roles_code_key'
      ) {

        throw new AppError({

          statusCode: 409,

          code: 'ROLE_007',

          message:
            'Role code already exists.'

        });

      }

      // DUPLICATE NAME
      if (
        err.constraint ===
        'roles_name_key'
      ) {

        throw new AppError({

          statusCode: 409,

          code: 'ROLE_008',

          message:
            'Role name already exists.'

        });

      }

    }


    // =================================================
    // INTERNAL SERVER ERROR
    // =================================================
    throw new AppError({

      statusCode: 500,

      code: 'ROLE_009',

      message:
        'Failed to create role.'

    });

  }

};


// -------------------------------------------------------------
// GET ALL ROLES
// -------------------------------------------------------------
exports.getRoles = async () => {

  const result = await pool.query(
    ROLE_QUERIES.GET_ALL_ROLES
  );

  return result.rows;

};

