
const request = require('supertest');
const app = require('../../app');
const { pool } = require('../../src/config/db');

const {
    getTestCreateUser,
    DUPLICATE_USER
} = require('../utils/constants');


describe('USER API TESTING', () => {

    // =====================================================
    // USER_01 - Create valid user
    // Expected Status Code: 201
    // =====================================================
    test('USER_01 - Create valid user', async () => {

        const response = await request(app)

            .post('/users')

            .send(
                getTestCreateUser()
            );

        console.log(
            'USER_01 Response:',
            response.body
        );

        expect(response.statusCode)
            .toBe(201);

        expect(response.body.success)
            .toBe(true);

    });


    // =====================================================
    // USER_02 - Create duplicate email user
    // Expected Status Code: 409
    // =====================================================
    test('USER_02 - Create duplicate email user', async () => {

        const response = await request(app)

            .post('/users')

            .send(
                DUPLICATE_USER
            );

        console.log(
            'USER_02 Response:',
            response.body
        );

        expect(response.statusCode)
            .toBe(409);

        expect(response.body.success)
            .toBe(false);

    });


    // =====================================================
    // USER_03 - Create user missing fields
    // Expected Status Code: 400
    // =====================================================
    test('USER_03 - Create user missing fields', async () => {

        const response = await request(app)

            .post('/users')

            .send({

                email: 'test@gmail.com'

            });

        console.log(
            'USER_03 Response:',
            response.body
        );

        expect(response.statusCode)
            .toBe(400);

        expect(response.body.success)
            .toBe(false);

    });


    // =====================================================
    // USER_04 - Create user invalid email
    // Expected Status Code: 400
    // =====================================================
    test('USER_04 - Create user invalid email', async () => {

        const response = await request(app)

            .post('/users')

            .send({

                first_name: 'Test',

                last_name: 'User',

                email: 'abc@',

                mobile: '9876543210',

                password: 'Admin@123'

            });

        console.log(
            'USER_04 Response:',
            response.body
        );

        expect(response.statusCode)
            .toBe(400);

        expect(response.body.success)
            .toBe(false);

    });


    // =====================================================
    // USER_05 - Create duplicate mobile
    // Expected Status Code: 201
    // =====================================================
    test('USER_05 - Create duplicate mobile', async () => {

        // FIRST USER
        await request(app)

            .post('/users')

            .send({

                first_name: 'First',

                last_name: 'User',

                email:
                    `first_${Date.now()}@gmail.com`,

                mobile: '9999999999',

                password: 'Admin@123'

            });

        // SECOND USER WITH SAME MOBILE
        const response = await request(app)

            .post('/users')

            .send({

                first_name: 'Second',

                last_name: 'User',

                email:
                    `second_${Date.now()}@gmail.com`,

                mobile: '9999999999',

                password: 'Admin@123'

            });

        console.log(
            'USER_05 Response:',
            response.body
        );

        expect(response.statusCode)
            .toBe(201);

        expect(response.body.success)
            .toBe(true);

    });

// =====================================================
// USER_06 - Create user with very long name
// Expected Status Code: 400
// =====================================================
test('USER_06 - Create user with very long name', async () => {

    const longName =
        'A'.repeat(500);

    const response = await request(app)

        .post('/users')

        .send({

            first_name: longName,

            last_name: longName,

            email:
                `long_${Date.now()}@gmail.com`,

            mobile: '9876543210',

            password: 'Admin@123'

        });

    console.log(
        'USER_06 Response:',
        response.body
    );

    expect(response.statusCode)
        .toBe(400);

    expect(response.body.success)
        .toBe(false);

});


// =====================================================
// USER_07 - Create user with special characters
// Expected Status Code: 400
// =====================================================
test('USER_07 - Create user with special characters', async () => {

    const response = await request(app)

        .post('/users')

        .send({

            first_name: '@@@###',

            last_name: '@@@###',

            email:
                `special_${Date.now()}@gmail.com`,

            mobile: '9876543210',

            password: 'Admin@123'

        });

    console.log(
        'USER_07 Response:',
        response.body
    );

    expect(response.statusCode)
        .toBe(400);

    expect(response.body.success)
        .toBe(false);

});


// =====================================================
// USER_08 - Create user with empty body
// Expected Status Code: 400
// =====================================================
test('USER_08 - Create user with empty body', async () => {

    const response = await request(app)

        .post('/users')

        .send({});

    console.log(
        'USER_08 Response:',
        response.body
    );

    expect(response.statusCode)
        .toBe(400);

    expect(response.body.success)
        .toBe(false);

});


// =====================================================
// USER_09 - Create user without password
// Expected Status Code: 400
// =====================================================
test('USER_09 - Create user without password', async () => {

    const response = await request(app)

        .post('/users')

        .send({

            first_name: 'Test',

            last_name: 'User',

            email:
                `nopass_${Date.now()}@gmail.com`,

            mobile: '9876543210'

        });

    console.log(
        'USER_09 Response:',
        response.body
    );

    expect(response.statusCode)
        .toBe(400);

    expect(response.body.success)
        .toBe(false);

});


// =====================================================
// USER_10 - Create user invalid mobile length
// Expected Status Code: 400
// =====================================================
test('USER_10 - Create user invalid mobile length', async () => {

    const response = await request(app)

        .post('/users')

        .send({

            first_name: 'Test',

            last_name: 'User',

            email:
                `mobile_${Date.now()}@gmail.com`,

            mobile: '1234',

            password: 'Admin@123'

        });

    console.log(
        'USER_10 Response:',
        response.body
    );

    expect(response.statusCode)
        .toBe(400);

    expect(response.body.success)
        .toBe(false);

});

// =====================================================
// USER_11 - Verify password hashing
// Expected Status Code: 201
// =====================================================
test('USER_11 - Verify password hashing', async () => {

    const userData = getTestCreateUser();

    const response = await request(app)

        .post('/users')

        .send(userData);

    console.log(
        'USER_11 Response:',
        response.body
    );

    expect(response.statusCode)
        .toBe(201);

    expect(response.body.success)
        .toBe(true);

    // PASSWORD SHOULD NOT RETURN
    expect(response.body.data)
        .not.toHaveProperty('password');

    expect(response.body.data)
        .not.toHaveProperty('password_hash');

});


// =====================================================
// USER_12 - Verify full_name generated
// Expected Status Code: 201
// =====================================================
test('USER_12 - Verify full_name generated', async () => {

    const response = await request(app)

        .post('/users')

        .send({

            first_name: 'John',

            last_name: 'Doe',

            email:
                `john_${Date.now()}@gmail.com`,

            mobile: '9876543211',

            password: 'Admin@123'

        });

    console.log(
        'USER_12 Response:',
        response.body
    );

    expect(response.statusCode)
        .toBe(201);

    expect(response.body.data.full_name)
        .toBe('John Doe');

});


// =====================================================
// USER_13 - Verify API response structure
// Expected Status Code: 201
// =====================================================
test('USER_13 - Verify API response structure', async () => {

    const response = await request(app)

        .post('/users')

        .send(getTestCreateUser());

    console.log(
        'USER_13 Response:',
        response.body
    );

    expect(response.statusCode)
        .toBe(201);

    expect(response.body)
        .toHaveProperty('success');

    expect(response.body)
        .toHaveProperty('message');

    expect(response.body)
        .toHaveProperty('data');

});


// =====================================================
// USER_14 - Verify success status code
// Expected Status Code: 201
// =====================================================
test('USER_14 - Verify success status code', async () => {

    const response = await request(app)

        .post('/users')

        .send(getTestCreateUser());

    console.log(
        'USER_14 Response:',
        response.body
    );

    expect(response.statusCode)
        .toBe(201);

});


// =====================================================
// USER_15 - Verify unsupported PUT method
// Expected Status Code: 404
// =====================================================
test('USER_15 - Verify unsupported PUT method', async () => {

    const response = await request(app)

        .put('/users')

        .send(getTestCreateUser());

    console.log(
        'USER_15 Response:',
        response.body
    );

    expect(response.statusCode)
        .toBe(404);

});


// =====================================================
// USER_16 - Verify internal server error handling
// Expected Status Code: 500
// =====================================================
test('USER_16 - Verify internal server error handling', async () => {

    const response = await request(app)

        .post('/users')

        .send({

            first_name: null,

            last_name: null,

            email: null,

            mobile: null,

            password: null

        });

    console.log(
        'USER_16 Response:',
        response.body
    );

    expect(response.body)
        .toHaveProperty('success');

});

});
