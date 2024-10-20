const pool = require('../../database/postgres/pool');

const container = require('../../container');

const createServer = require('../createServer');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');

const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentTableTestHelper = require('../../../../tests/CommentTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');

describe('/threads/{threadId}/comments/{commentId}/likes', () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
    await CommentTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('PUT /threads/{threadId}/comments/{commentId}/likes', () => {
    it('response 401 when missing authentication', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentTableTestHelper.NewComment({});

      const server = await createServer(container);

      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-557/comments/comment-test2024/likes',
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
    });

    it('response 404 when comment is not found', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});

      const server = await createServer(container);

      const accessToken = await ServerTestHelper.getAccessToken();

      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-557/comments/comment-random123/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
    });

    it('should response 200 when like or unlike success', async () => {
      await UsersTableTestHelper.addUser({});
      await ThreadsTableTestHelper.addThread({});
      await CommentTableTestHelper.NewComment({});
      await LikesTableTestHelper.addCommentLike({});

      const server = await createServer(container);
      const accessToken = await ServerTestHelper.getAccessToken();

      const response = await server.inject({
        method: 'PUT',
        url: '/threads/thread-557/comments/comment-test2024/likes',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
