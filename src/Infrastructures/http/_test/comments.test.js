const pool = require('../../database/postgres/pool');

const container = require('../../container');
const createServer = require('../createServer');

const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');

describe('/threads/{threadId/comments endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable()
        await ThreadsTableTestHelper.cleanTable()
        await CommentsTableTestHelper.cleanTable()
    })

    describe('POST /threads/{threadId/comments', () => {
        it('should response 400 when request payload not contain needed property', async () => {
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});

            const server = await createServer(container);

            const accessToken = await ServerTestHelper.getAccessToken();

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-557/comments',
                headers: {
                    Authorization: `Bearer ${accessToken}`
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada')
        })

        it('should response 400 when request payload not meet data type specification', async () => {
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});

            const requestPayload = {
                content: [],
            };

            const server = await createServer(container);

            const accessToken = await ServerTestHelper.getAccessToken();

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-557/comments',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat comment baru karena tipe data tidak sesuai');
        });


            it('should response 401 when missing authentication', async () => {
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});

            const requestPayload = {
                content: 'lorem ipsum dolor sit amet',
            };

            const server = await createServer(container);

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-557/comments',
                payload: requestPayload,
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.error).toEqual('Unauthorized');
        });
        it('should response 201 and added comment', async () => {
            const server = await createServer(container);

            const accessToken = await ServerTestHelper.getAccessToken();

            const result = await pool.query('SELECT * FROM users WHERE username = $1', ['test']);
            const {id: owner} = result.rows[0];

            await ThreadsTableTestHelper.addThread({owner});
            await CommentsTableTestHelper.NewComment({userId: owner});

            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-558/comments/comment-test2024',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        })
    })
})