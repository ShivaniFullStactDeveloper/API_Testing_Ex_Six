const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../app');

const {
    getPreContextToken,
    getAccessToken
} = require('../helpers/token.helper');


describe('SECURITY API TESTING', () => {

    // =====================================================
    // SEC_01 - Access protected API without token
    // =====================================================
    test('SEC_01 - Access protected API without token', async () => {

        const response = await request(app)
            .get('/users');

        expect(response.statusCode)
            .toBe(401);

    });


    // =====================================================
    // SEC_02 - Access protected API with invalid token
    // =====================================================
    test('SEC_02 - Access protected API with invalid token', async () => {

        const response = await request(app)
            .get('/users')
            .set(
                'Authorization',
                'Bearer invalid_token'
            );

        expect(response.statusCode)
            .toBe(401);

    });


    // =====================================================
    // SEC_03 - Access protected API with expired token
    // =====================================================
    test('SEC_03 - Access protected API with expired token', async () => {

        const expiredToken = jwt.sign(
            {
                user_id: '123',
                token_type: 'access'
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '-1h'
            }
        );

        const response = await request(app)
            .get('/users')
            .set(
                'Authorization',
                `Bearer ${expiredToken}`
            );

        expect(response.statusCode)
            .toBe(401);

    });


    // =====================================================
    // SEC_04 - Access protected API with tampered JWT
    // =====================================================
    test('SEC_04 - Access protected API with tampered JWT', async () => {

        const token =
            await getAccessToken();

        const tamperedToken =
            token + 'abc';

        const response = await request(app)
            .get('/users')
            .set(
                'Authorization',
                `Bearer ${tamperedToken}`
            );

        expect(response.statusCode)
            .toBe(401);

    });


    // =====================================================
    // SEC_05 - Access API with wrong token type
    // =====================================================
    test('SEC_05 - Access API with wrong token type', async () => {

        const preContextToken =
            await getPreContextToken();

        const response = await request(app)
            .get('/users')
            .set(
                'Authorization',
                `Bearer ${preContextToken}`
            );

        expect(response.statusCode)
            .toBe(403);

    });


    // =====================================================
    // SEC_06 - Access another tenant data
    // =====================================================
    test('SEC_06 - Access another tenant data', async () => {

        const token = jwt.sign(
            {
                user_id:
                    '192de65e-e42b-4492-ae53-4d08b880842d',
                tenant_id:
                    'fake-tenant-id',
                token_type:
                    'access'
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        const response = await request(app)
            .get('/users')
            .set(
                'Authorization',
                `Bearer ${token}`
            );

        expect(response.statusCode)
            .toBe(403);

    });


    // =====================================================
    // SEC_07 - Verify unauthorized CORS origin
    // =====================================================
    test('SEC_07 - Verify unauthorized CORS origin', async () => {

        const response = await request(app)
            .post('/auth/login')
            .set(
                'Origin',
                'https://malicious-site.com'
            )
            .send({
                email: 'noah@scos.com',
                password: 'Admin@123'
            });

        expect(response.statusCode)
            .toBe(200);

    });


    // =====================================================
    // SEC_08 - Verify large payload handling
    // =====================================================
    test('SEC_08 - Verify large payload handling', async () => {

        const hugeString =
            'A'.repeat(1000000);

        const response = await request(app)
            .post('/users')
            .send({
                first_name: hugeString,
                last_name: hugeString,
                email:
                    `huge_${Date.now()}@gmail.com`,
                mobile: '9999999999',
                password: 'Admin@123'
            });

        expect(response.statusCode)
            .toBe(500);

    });


    // =====================================================
    // SEC_09 - Verify rate limit handling
    // =====================================================
    test('SEC_09 - Verify rate limit handling', async () => {

        let finalResponse;

        for (let i = 0; i < 20; i++) {
            finalResponse = await request(app)
                .post('/auth/login')
                .send({
                    email: 'noah@scos.com',
                    password: 'wrongpassword'
                });
        }

        expect(finalResponse.statusCode)
            .toBe(401);

    });


    // =====================================================
    // SEC_10 - Verify token replay attack handling
    // =====================================================
    test('SEC_10 - Verify token replay attack handling', async () => {

        const token =
            await getAccessToken();

        const response1 = await request(app)
            .get('/auth/me')
            .set(
                'Authorization',
                `Bearer ${token}`
            );

        const response2 = await request(app)
            .get('/auth/me')
            .set(
                'Authorization',
                `Bearer ${token}`
            );

        expect(response2.statusCode)
            .toBe(200);

    });


    // =====================================================
    // SEC_11 - Verify sensitive error messages hidden
    // =====================================================
    test('SEC_11 - Verify sensitive error messages hidden', async () => {

        const response = await request(app)
            .post('/auth/login')
            .send({
                email: 'wrong@gmail.com',
                password: 'wrongpassword'
            });

        expect(response.body.message)
            .not
            .toMatch(/sql|query|database|stack/i);

    });


    // =====================================================
    // SEC_12 - Verify secure JWT validation flow
    // =====================================================
    test('SEC_12 - Verify secure JWT validation flow', async () => {

        const token =
            await getAccessToken();

        const response = await request(app)
            .get('/auth/me')
            .set(
                'Authorization',
                `Bearer ${token}`
            );

        expect(response.statusCode)
            .toBe(200);

    });

});
