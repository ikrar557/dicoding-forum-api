const pool = require('../../database/postgres/pool');

const container = require('../../container');
const createServer = require('../createServer');

const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ServerTestHelper = require('../../../../tests/ServerTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');

describe('test /threads endpoint', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should response 401 when missing authentication', async () => {
      const requestPayload = {
        title: 'random thread title',
        body: 'random thread body',
      };

      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const requestPayload = {
        title: 'random thread title',
      };

      const server = await createServer(container);

      const accessToken = await ServerTestHelper.getAccessToken();

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const requestPayload = {
        title: 'random thread title',
        body: true,
      };

      const server = await createServer(container);

      const accessToken = await ServerTestHelper.getAccessToken();

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
    });

    it('should response 201 and persisted thread', async () => {
      const requestPayload = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };

      const server = await createServer(container);

      const accessToken = await ServerTestHelper.getAccessToken();

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: requestPayload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
      expect(responseJson.data.addedThread.id).toBeDefined();
      expect(responseJson.data.addedThread.title).toEqual(requestPayload.title);
      expect(responseJson.data.addedThread.owner).toBeDefined();
    });
  });

  describe('when GET /threads/{threadId}', () => {
      it('should response 404 when thread is not found', async () => {
          await UsersTableTestHelper.addUser({});
          await ThreadsTableTestHelper.addThread({});

          const server = await createServer(container);

          const response = await server.inject({
              method: 'GET',
              url: '/threads/thread-123',
          });

          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(404);
          expect(responseJson.status).toEqual('fail');
          expect(responseJson.message).toEqual('tidak dapat menemukan thread yang dicari');
      });

      it('should response 200 along with the detail thread when thread is found', async () => {
          await UsersTableTestHelper.addUser({});
          await ThreadsTableTestHelper.addThread({});

          const server = await createServer(container);

          const response = await server.inject({
              method: 'GET',
              url: '/threads/thread-557',
          });

          const responseJson = JSON.parse(response.payload);
          expect(response.statusCode).toEqual(200);
          expect(responseJson.status).toEqual('success');
          expect(responseJson.data.thread).toBeDefined();
          expect(responseJson.data.thread.id).toEqual('thread-557');
          expect(responseJson.data.thread.title).toBeDefined();
          expect(responseJson.data.thread.body).toBeDefined();
          expect(responseJson.data.thread.date).toBeDefined();
          expect(responseJson.data.thread.username).toBeDefined();
      });
  });
});
