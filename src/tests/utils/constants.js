
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

// =========================================================
// INSTITUTE TEST DATA
// =========================================================
exports.getTestInstitute = () => ({

  tenant_id:
    '4ba86db5-68b3-4f20-9f86-81f2d805126f',

  name:
    'Test Institute',

  code:
    `INST_${Date.now()}`,

  type:
    'School',

  logo:
    null,

  city:
    'Pune',

  state:
    'Maharashtra'

});


// =========================================================
// DUPLICATE INSTITUTE
// =========================================================
exports.DUPLICATE_INSTITUTE = {

  tenant_id:
    '4ba86db5-68b3-4f20-9f86-81f2d805126f',

  name: 'SCOS Institute',

  code: 'SCOS001',

  type: 'School',

  logo: null,

  city: 'Nagpur',

  state: 'Maharashtra'

};

// =========================================================
// ROLE TEST DATA
// =========================================================
exports.getTestRole = () => ({

    name:
        `Test Role`,

    code:
        `ROLE_${Date.now()}`,

    icon:
        'user'

});


// =========================================================
// DUPLICATE ROLE
// =========================================================
exports.DUPLICATE_ROLE = {

    name:
        'Admin',

    code:
        'ADMIN',

    icon:
        'shield'

};


