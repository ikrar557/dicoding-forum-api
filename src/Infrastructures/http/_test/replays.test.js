const pool = require('../../database/postgres/pool');
const container = require('../../container');

const createServer = require('../createServer');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');

const CommentsTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ReplaysTableTestHelper = require('../../../../tests/ReplaysTableTestHelper');

describe('/threads/{threadId}/comments/{commentId}/replies', () => {
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await ReplaysTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('POST /threads/{threadId}/comments/{commentId}/replies', () => {
        it('response 401 when missing authentication', async () => {
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.NewComment({});

            const requestPayload = {
                content: 'random replay',
            };

            const server = await createServer(container);

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-557/comments/comment-test2024/replies',
                payload: requestPayload,
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.error).toEqual('Unauthorized');
        });

        it('response 400 when request payload not contain needed property', async () => {
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.NewComment({});

            const server = await createServer(container);

            const accessToken = await ServerTestHelper.getAccessToken();

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-557/comments/comment-test2024/replies',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat replay baru karena properti yang dibutuhkan tidak ada');
        });

        it('should response 400 when request payload not meet data type specification', async () => {
            await UsersTableTestHelper.addUser({});
            await ThreadsTableTestHelper.addThread({});
            await CommentsTableTestHelper.NewComment({});

            const requestPayload = {
                content: true,
            };

            const server = await createServer(container);

            const accessToken = await ServerTestHelper.getAccessToken();

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-557/comments/comment-test2024/replies',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat replay baru karena tipe data tidak sesuai');
        });

        it('should response 201 and persisted comment', async () => {
            const requestPayload = {
                content: 'random replay',
            };

            const server = await createServer(container);

            const accessToken = await ServerTestHelper.getAccessToken();

            const result = await pool.query('SELECT * FROM users WHERE username = $1', ['ikrar']);
            const { id: owner } = result.rows[0];
            await ThreadsTableTestHelper.addThread({ owner });
            await CommentsTableTestHelper.NewComment({ userId: owner });

            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-557/comments/comment-test2024/replies',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedReplay).toBeDefined();
            expect(responseJson.data.addedReplay.id).toBeDefined();
            expect(responseJson.data.addedReplay.content).toEqual(requestPayload.content);
            expect(responseJson.data.addedReplay.owner).toBeDefined();
        });
    });
})