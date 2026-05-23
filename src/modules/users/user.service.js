// =============================================================
// SERVICE: user.service.js
// Handles user creation business logic.
// =============================================================

const { pool } = require('../../config/db');
const bcrypt = require("bcrypt");
const { AppError, ERRORS } = require("../../config/errors");

// -------------------------------------------------------------
// CREATE USER
// Hashes the password, constructs the full name,
// and inserts a new user record into the database.
// Returns id, full_name, and email on success.
// -------------------------------------------------------------

exports.createUser = async (data) => {

  const {
    first_name,
    last_name,
    email,
    mobile,
    password
  } = data;

  // =====================================================
  // REQUIRED FIELD VALIDATION
  // =====================================================
  if (
    !first_name ||
    !last_name ||
    !email ||
    !mobile ||
    !password
  ) {

    throw new AppError({
      statusCode: 400,
      code: 'USER_003',
      message: 'All fields are required.'
    });

  }

  // =====================================================
  // EMAIL VALIDATION
  // =====================================================
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {

    throw new AppError({
      statusCode: 400,
      code: 'USER_004',
      message: 'Invalid email format.'
    });

  }

  // =====================================================
  // NAME LENGTH VALIDATION
  // =====================================================
  if (
    first_name.length > 50 ||
    last_name.length > 50
  ) {

    throw new AppError({
      statusCode: 400,
      code: 'USER_006',
      message:
        'First name and last name must be less than 50 characters.'
    });

  }


  // =====================================================
  // NAME CHARACTER VALIDATION
  // =====================================================
  const nameRegex = /^[A-Za-z\s]+$/;

  if (
    !nameRegex.test(first_name) ||
    !nameRegex.test(last_name)
  ) {

    throw new AppError({
      statusCode: 400,
      code: 'USER_007',
      message:
        'Name must contain only alphabets.'
    });

  }


  // =====================================================
  // MOBILE VALIDATION
  // =====================================================
  const mobileRegex = /^[0-9]{10}$/;

  if (!mobileRegex.test(mobile)) {

    throw new AppError({
      statusCode: 400,
      code: 'USER_008',
      message:
        'Mobile number must be 10 digits.'
    });

  }

  // =====================================================
  // HASH PASSWORD
  // =====================================================
  const hashedPassword =
    await bcrypt.hash(password, 10);

  const full_name =
    `${first_name} ${last_name}`;

  try {

    const result = await pool.query(

      `INSERT INTO users
        (
          first_name,
          last_name,
          full_name,
          email,
          mobile,
          password_hash
        )
       VALUES ($1, $2, $3, $4, $5, $6)

       RETURNING
          id,
          full_name,
          email`,

      [
        first_name,
        last_name,
        full_name,
        email,
        mobile,
        hashedPassword
      ]

    );

    return result.rows[0];

  } catch (err) {

    // DUPLICATE EMAIL
    if (err.code === "23505") {

      throw new AppError(
        ERRORS.USER_ALREADY_EXISTS
      );

    }

    throw new AppError(
      ERRORS.USER_CREATE_FAILED
    );

  }

};


