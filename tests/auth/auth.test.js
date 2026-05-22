const request = require('supertest');
const app = require('../../../app');
const { TEST_USERS } = require('../utils/constants');
const { getPreContextToken, getAccessToken } = require('../helpers/token.helper');
// const { pool } = require('../../config/db');

describe('AUTH API TESTING', () => {

    // =========================================================
    // AUTH_01 - Login with valid credentials
    // Expected Status Code: 200
    // =========================================================
    test('AUTH_01 - Login with valid credentials', async () => {

        const response = await request(app)
            .post('/auth/login')
            .send(TEST_USERS.MULTIPLE_INSTITUTE_MULTIPLE_ROLE);

        console.log('AUTH_01 Response:', response.body);

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.pre_context_token)
            .toBeDefined();

    });


    // =========================================================
    // AUTH_02 - Login with invalid email
    // Expected Status Code: 401
    // =========================================================
    test('AUTH_02 - Login with invalid email', async () => {

        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'wrong@gmail.com',
                password: '123456'
            });

        console.log('AUTH_02 Response:', response.body);

        expect(response.statusCode).toBe(401);

        expect(response.body.success).toBe(false);

    });


    // =========================================================
    // AUTH_03 - Login with wrong password
    // Expected Status Code: 401
    // =========================================================
    test('AUTH_03 - Login with wrong password', async () => {

        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'noah@scos.com',
                password: '12345'
            });

        console.log('AUTH_03 Response:', response.body);

        expect(response.statusCode).toBe(401);

        expect(response.body.success).toBe(false);

    });


    // =========================================================
    // AUTH_04 - Login with empty password
    // Expected Status Code: 400
    // =========================================================
    test('AUTH_04 - Login with empty password', async () => {

        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'noah@scos.com',
                password: ''
            });

        console.log('AUTH_04 Response:', response.body);

        expect(response.statusCode).toBe(400);

        expect(response.body.success).toBe(false);

    });


    // =========================================================
    // AUTH_05 - Login with invalid email format
    // Expected Status Code: 400
    // =========================================================
    test('AUTH_05 - Login with invalid email format', async () => {

        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'abc@',
                password: '123456'
            });

        console.log('AUTH_05 Response:', response.body);

        expect(response.statusCode).toBe(400);

        expect(response.body.success).toBe(false);

    });

    // =========================================================
    // AUTH_06 - Login without request body
    // Expected Status Code: 400
    // =========================================================
    test('AUTH_06 - Login without request body', async () => {

        const response = await request(app)
            .post('/auth/login')
            .send({});

        console.log('AUTH_06 Response:', response.body);

        expect(response.statusCode).toBe(400);

        expect(response.body.success).toBe(false);

        expect(response.body.message)
            .toBe('Email and password are required.');

    });


    // =========================================================
    // AUTH_07 - Login with SQL injection payload
    // Expected Status Code: 401
    // =========================================================
    test('AUTH_07 - Login with SQL injection payload', async () => {

        const response = await request(app)
            .post('/auth/login')
            .send({
                email: "' OR 1=1 --",
                password: "' OR 1=1 --"
            });

        console.log('AUTH_07 Response:', response.body);

        expect(response.statusCode).toBe(400);

        expect(response.body.success).toBe(false);

    });


    // =========================================================
    // AUTH_08 - Login with XSS payload
    // Expected Status Code: 400
    // =========================================================
    test('AUTH_08 - Login with XSS payload', async () => {

        const response = await request(app)
            .post('/auth/login')
            .send({
                email: '<script>alert("xss")</script>',
                password: '123456'
            });

        console.log('AUTH_08 Response:', response.body);

        expect(response.statusCode).toBe(400);

        expect(response.body.success).toBe(false);

    });


    // =========================================================
    // AUTH_09 - Verify password hash not returned
    // Expected Status Code: 200
    // =========================================================
    test('AUTH_09 - Verify password hash not returned', async () => {

        const response = await request(app)
            .post('/auth/login')
            .send(TEST_USERS.MULTIPLE_INSTITUTE_MULTIPLE_ROLE);

        console.log('AUTH_09 Response:', response.body);

        expect(response.statusCode).toBe(200);

        expect(response.body.user.password_hash)
            .toBeUndefined();

    });


    // =========================================================
    // AUTH_10 - Verify login response structure
    // Expected Status Code: 200
    // =========================================================
    test('AUTH_10 - Verify login response structure', async () => {

        const response = await request(app)
            .post('/auth/login')
            .send(TEST_USERS.MULTIPLE_INSTITUTE_MULTIPLE_ROLE);

        console.log('AUTH_10 Response:', response.body);

        expect(response.statusCode).toBe(200);

        expect(response.body)
            .toHaveProperty('success');

        expect(response.body)
            .toHaveProperty('message');

        expect(response.body)
            .toHaveProperty('pre_context_token');

        expect(response.body)
            .toHaveProperty('user');

    });

    // =========================================================
    // AUTH_11 - Fetch institutes with valid token
    // Expected Status Code: 200
    // =========================================================
    test('AUTH_11 - Fetch institutes with valid token', async () => {

        const token =
            await getPreContextToken();

        const response = await request(app)
            .get('/auth/my-institutes-roles')
            .set(
                'Authorization',
                `Bearer ${token}`
            );

        console.log(
            'AUTH_11 Response:',
            response.body
        );

        expect(response.statusCode)
            .toBe(200);

        expect(response.body.success)
            .toBe(true);

    });


    // =========================================================
    // AUTH_12 - Fetch institutes without token
    // Expected Status Code: 401
    // =========================================================
    test('AUTH_12 - Fetch institutes without token', async () => {

        const response = await request(app)
            .get('/auth/my-institutes-roles');

        console.log(
            'AUTH_12 Response:',
            response.body
        );

        expect(response.statusCode)
            .toBe(401);

        expect(response.body.success)
            .toBe(false);

    });


    // =========================================================
    // AUTH_13 - Fetch institutes with invalid token
    // Expected Status Code: 401
    // =========================================================
    test('AUTH_13 - Fetch institutes with invalid token', async () => {

        const response = await request(app)
            .get('/auth/my-institutes-roles')
            .set(
                'Authorization',
                'Bearer invalid_token'
            );

        console.log(
            'AUTH_13 Response:',
            response.body
        );

        expect(response.statusCode)
            .toBe(401);

        expect(response.body.success)
            .toBe(false);

    });


    // =========================================================
    // AUTH_14 - Fetch institutes with expired token
    // Expected Status Code: 401
    // =========================================================
    test('AUTH_14 - Fetch institutes with expired token', async () => {

        const expiredToken =
            'expired.jwt.token';

        const response = await request(app)
            .get('/auth/my-institutes-roles')
            .set(
                'Authorization',
                `Bearer ${expiredToken}`
            );

        console.log(
            'AUTH_14 Response:',
            response.body
        );

        expect(response.statusCode)
            .toBe(401);

        expect(response.body.success)
            .toBe(false);

    });


    // =========================================================
    // AUTH_15 - Select valid institute context
    // Expected Status Code: 200
    // =========================================================
    test('AUTH_15 - Select valid institute context', async () => {

        const token =
            await getPreContextToken();

        const response = await request(app)
            .post('/auth/select-context')
            .set(
                'Authorization',
                `Bearer ${token}`
            )
            .send({

                tenant_id:
                    '4ba86db5-68b3-4f20-9f86-81f2d805126f',

                institute_id:
                    '3bd4c00b-4ea9-440c-aea4-1e614ffdff65',

                role_id:
                    '54523f9b-8e00-46fc-b67a-b4c779859fd9'

            });

        console.log(
            'AUTH_15 Response:',
            response.body
        );

        expect(response.statusCode)
            .toBe(200);

        expect(response.body.success)
            .toBe(true);

        expect(response.body.access_token)
            .toBeDefined();

    });

    // =========================================================
    // AUTH_16 - Select context with invalid tenant_id
    // Expected Status Code: 403
    // =========================================================
    test('AUTH_16 - Select context with invalid tenant_id', async () => {

        const token =
            await getPreContextToken();

        const response = await request(app)
            .post('/auth/select-context')
            .set(
                'Authorization',
                `Bearer ${token}`
            )
            .send({

                tenant_id:
                    '11111111-1111-1111-1111-111111111111',

                institute_id:
                    '3bd4c00b-4ea9-440c-aea4-1e614ffdff65',

                role_id:
                    '54523f9b-8e00-46fc-b67a-b4c779859fd9'

            });

        console.log(
            'AUTH_16 Response:',
            response.body
        );

        expect(response.statusCode)
            .toBe(403);

        expect(response.body.success)
            .toBe(false);

    });


    // =========================================================
    // AUTH_17 - Select context with invalid institute_id
    // Expected Status Code: 403
    // =========================================================
    test('AUTH_17 - Select context with invalid institute_id', async () => {

        const token =
            await getPreContextToken();

        const response = await request(app)
            .post('/auth/select-context')
            .set(
                'Authorization',
                `Bearer ${token}`
            )
            .send({

                tenant_id:
                    '4ba86db5-68b3-4f20-9f86-81f2d805126f',

                institute_id:
                    '22222222-2222-2222-2222-222222222222',

                role_id:
                    '54523f9b-8e00-46fc-b67a-b4c779859fd9'

            });

        console.log(
            'AUTH_17 Response:',
            response.body
        );

        expect(response.statusCode)
            .toBe(403);

        expect(response.body.success)
            .toBe(false);

    });


    // =========================================================
    // AUTH_18 - Select context with invalid role_id
    // Expected Status Code: 403
    // =========================================================
    test('AUTH_18 - Select context with invalid role_id', async () => {

        const token =
            await getPreContextToken();

        const response = await request(app)
            .post('/auth/select-context')
            .set(
                'Authorization',
                `Bearer ${token}`
            )
            .send({

                tenant_id:
                    '4ba86db5-68b3-4f20-9f86-81f2d805126f',

                institute_id:
                    '3bd4c00b-4ea9-440c-aea4-1e614ffdff65',

                role_id:
                    '33333333-3333-3333-3333-333333333333'

            });

        console.log(
            'AUTH_18 Response:',
            response.body
        );

        expect(response.statusCode)
            .toBe(403);

        expect(response.body.success)
            .toBe(false);

    });


    // =========================================================
    // AUTH_19 - Select context with missing fields
    // Expected Status Code: 400
    // =========================================================
    test('AUTH_19 - Select context with missing fields', async () => {

        const token =
            await getPreContextToken();

        const response = await request(app)
            .post('/auth/select-context')
            .set(
                'Authorization',
                `Bearer ${token}`
            )
            .send({

                tenant_id:
                    '4ba86db5-68b3-4f20-9f86-81f2d805126f',

                institute_id:
                    '3bd4c00b-4ea9-440c-aea4-1e614ffdff65',

            });

        console.log(
            'AUTH_19 Response:',
            response.body
        );

        expect(response.statusCode)
            .toBe(400);

        expect(response.body.success)
            .toBe(false);

    });


// =========================================================
// AUTH_20 - Access /me with valid token
// Expected Status Code: 200
// =========================================================
test('AUTH_20 - Access /me with valid token', async () => {

    const token =
        await getAccessToken();

    const response = await request(app)

        .get('/auth/me')

        .set(
            'Authorization',
            `Bearer ${token}`
        );

    console.log(
        'AUTH_20 Response:',
        response.body
    );

    expect(response.statusCode)
        .toBe(200);

    expect(response.body.success)
        .toBe(true);

    expect(response.body)
        .toHaveProperty('data');

});

// =========================================================
// AUTH_21 - Access /me without token
// Expected Status Code: 401
// =========================================================
test('AUTH_21 - Access /me without token', async () => {

    const response = await request(app)

        .get('/auth/me');

    console.log(
        'AUTH_21 Response:',
        response.body
    );

    expect(response.statusCode)
        .toBe(401);

    expect(response.body.success)
        .toBe(false);

});


// =========================================================
// AUTH_22 - Access /me with invalid token
// Expected Status Code: 401
// =========================================================
test('AUTH_22 - Access /me with invalid token', async () => {

    const response = await request(app)

        .get('/auth/me')

        .set(
            'Authorization',
            'Bearer invalid_token'
        );

    console.log(
        'AUTH_22 Response:',
        response.body
    );

    expect(response.statusCode)
        .toBe(401);

    expect(response.body.success)
        .toBe(false);

});


// =========================================================
// AUTH_23 - Access /me with expired token
// Expected Status Code: 401
// =========================================================
test('AUTH_23 - Access /me with expired token', async () => {

    const expiredToken =
        'expired.jwt.token';

    const response = await request(app)

        .get('/auth/me')

        .set(
            'Authorization',
            `Bearer ${expiredToken}`
        );

    console.log(
        'AUTH_23 Response:',
        response.body
    );

    expect(response.statusCode)
        .toBe(401);

    expect(response.body.success)
        .toBe(false);

});


// =========================================================
// AUTH_24 - Access /me with tampered JWT
// Expected Status Code: 401
// =========================================================
test('AUTH_24 - Access /me with tampered JWT', async () => {

    const token =
        await getAccessToken();

    // Tamper JWT
    const tamperedToken =
        token + 'abc123';

    const response = await request(app)

        .get('/auth/me')

        .set(
            'Authorization',
            `Bearer ${tamperedToken}`
        );

    console.log(
        'AUTH_24 Response:',
        response.body
    );

    expect(response.statusCode)
        .toBe(401);

    expect(response.body.success)
        .toBe(false);

});


// =========================================================
// AUTH_25 - Verify JWT secret validation
// Expected Status Code: 401
// =========================================================
test('AUTH_25 - Verify JWT secret validation', async () => {

    // Fake forged JWT
    const forgedToken =
        'ey.fake.jwt.token';

    const response = await request(app)

        .get('/auth/me')

        .set(
            'Authorization',
            `Bearer ${forgedToken}`
        );

    console.log(
        'AUTH_25 Response:',
        response.body
    );

    expect(response.statusCode)
        .toBe(401);

    expect(response.body.success)
        .toBe(false);

});

// =========================================================
// AUTH_26 - Verify Authorization header missing Bearer
// Expected Status Code: 401
// =========================================================
test('AUTH_26 - Verify Authorization header missing Bearer', async () => {

    const token =
        await getAccessToken();

    const response = await request(app)

        .get('/auth/me')

        .set(
            'Authorization',
            token
        );

    console.log(
        'AUTH_26 Response:',
        response.body
    );

    expect(response.statusCode)
        .toBe(401);

    expect(response.body.success)
        .toBe(false);

});


// =========================================================
// AUTH_27 - Verify malformed JSON body
// Expected Status Code: 400
// =========================================================
test('AUTH_27 - Verify malformed JSON body', async () => {

    const response = await request(app)

        .post('/auth/login')

        .set(
            'Content-Type',
            'application/json'
        )

        .send('{"email":"test@gmail.com",}');

    console.log(
        'AUTH_27 Response:',
        response.body
    );

    expect(response.statusCode)
        .toBe(400);

});


// =========================================================
// AUTH_28 - Verify unsupported HTTP method
// Expected Status Code: 405
// =========================================================
test('AUTH_28 - Verify unsupported HTTP method', async () => {

    const response = await request(app)

        .get('/auth/login');

    console.log(
        'AUTH_28 Response:',
        response.body
    );

    expect([404, 405])
        .toContain(response.statusCode);

});

});


