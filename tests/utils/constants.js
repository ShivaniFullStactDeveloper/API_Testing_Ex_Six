
// exports.TEST_USERS = {

//   SINGLE_INSTITUTE_SINGLE_ROLE: {
//     email: 'ryan@scos.com',
//     password: 'Admin@123'
//   },

//   MULTIPLE_INSTITUTE_SINGLE_ROLE: {
//     email: 'emily@scos.com',
//     password: 'Admin@123'
//   },

//   SINGLE_INSTITUTE_MULTIPLE_ROLE: {
//     email: 'chris@scos.com',
//     password: 'Admin@123'
//   },

//   MULTIPLE_INSTITUTE_MULTIPLE_ROLE: {
//     email: 'noah@scos.com',
//     password: 'Admin@123'
//   },

//   NO_INSTITUTE_ASSIGNED: {
//     email: 'alex@scos.com',
//     password: 'Admin@123'
//   }

// };


// // =========================================================
// // USER TEST DATA
// // Dynamic user generator
// // =========================================================
// exports.getTestCreateUser = () => ({

//   first_name: 'Test',

//   last_name: 'User',

//   email:
//     `testuser_${Date.now()}@gmail.com`,

//   mobile:
//     '9876543210',

//   password:
//     'Admin@123'

// });

// // =========================================================
// // DUPLICATE USER
// // =========================================================
// exports.DUPLICATE_USER = {

//   full_name: 'Noah Parker',

//   email: 'noah@scos.com',

//   password: 'Admin@123'

// };


exports.TEST_USERS = {

  SINGLE_INSTITUTE_SINGLE_ROLE: {

    email: 'ryan@scos.com',

    password: 'Admin@123'

  },

  MULTIPLE_INSTITUTE_SINGLE_ROLE: {

    email: 'emily@scos.com',

    password: 'Admin@123'

  },

  SINGLE_INSTITUTE_MULTIPLE_ROLE: {

    email: 'chris@scos.com',

    password: 'Admin@123'

  },

  MULTIPLE_INSTITUTE_MULTIPLE_ROLE: {

    email: 'noah@scos.com',

    password: 'Admin@123'

  },

  NO_INSTITUTE_ASSIGNED: {

    email: 'alex@scos.com',

    password: 'Admin@123'

  }

};


// =========================================================
// USER TEST DATA
// Dynamic user generator
// =========================================================
exports.getTestCreateUser = () => ({

  first_name: 'Test',

  last_name: 'User',

  email:
    `testuser_${Date.now()}@gmail.com`,

  mobile:
    '9876543210',

  password:
    'Admin@123'

});


// =========================================================
// DUPLICATE USER
// =========================================================
exports.DUPLICATE_USER = {

  first_name: 'Noah',

  last_name: 'Parker',

  email: 'noah@scos.com',

  mobile: '9876543210',

  password: 'Admin@123'

};


