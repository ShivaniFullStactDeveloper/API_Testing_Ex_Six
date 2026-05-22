const request = require('supertest');
const app = require('../../../app');

const {
    TEST_USERS
} = require('../utils/constants');


// =========================================================
// GET PRE CONTEXT TOKEN
// =========================================================
exports.getPreContextToken = async () => {

    const response = await request(app)
        .post('/auth/login')
        .send(
            TEST_USERS.MULTIPLE_INSTITUTE_MULTIPLE_ROLE
        );

    return response.body.pre_context_token;

};

// =========================================================
// GET ACCESS TOKEN
// =========================================================
exports.getAccessToken = async () => {

    // LOGIN
    const loginResponse = await request(app)

        .post('/auth/login')

        .send(
            TEST_USERS.MULTIPLE_INSTITUTE_MULTIPLE_ROLE
        );

    const preContextToken =
        loginResponse.body.pre_context_token;

    // SELECT CONTEXT
    const contextResponse = await request(app)

        .post('/auth/select-context')

        .set(
            'Authorization',
            `Bearer ${preContextToken}`
        )

        .send({

            tenant_id:
                '4ba86db5-68b3-4f20-9f86-81f2d805126f',

            institute_id:
                '3bd4c00b-4ea9-440c-aea4-1e614ffdff65',

            role_id:
                '54523f9b-8e00-46fc-b67a-b4c779859fd9'

        });

    return contextResponse.body.access_token;

};

